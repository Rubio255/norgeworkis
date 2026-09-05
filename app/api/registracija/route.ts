import {
  NextRequest,
  NextResponse,
} from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

export const runtime =
  "nodejs";

const MAX_CV_SIZE =
  10 * 1024 * 1024;

const ALLOWED_CV_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
];

const ALLOWED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
];

const RATE_LIMIT_MINUTES = 15;
const RATE_LIMIT_MAX_REQUESTS = 5;

function cleanText(
  value: FormDataEntryValue | null,
  maxLength: number
) {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .slice(0, maxLength);
}

function validateName(
  value: string,
  fieldName: string
) {
  if (value.length < 2) {
    return `${fieldName} turi būti bent 2 raidžių.`;
  }

  if (value.length > 50) {
    return `${fieldName} per ilgas.`;
  }

  const namePattern =
    /^[\p{L}][\p{L}'’ -]*[\p{L}]$/u;

  if (
    !namePattern.test(value)
  ) {
    return `${fieldName} gali būti sudarytas tik iš raidžių, tarpų, brūkšnelio arba apostrofo.`;
  }

  const lettersOnly =
    value
      .toLocaleLowerCase(
        "lt-LT"
      )
      .replace(
        /[^\p{L}]/gu,
        ""
      );

  if (
    lettersOnly.length >= 3 &&
    new Set(
      lettersOnly
    ).size === 1
  ) {
    return `Įveskite tikrą ${fieldName.toLowerCase()}.`;
  }

  const blockedNames = [
    "test",
    "testas",
    "asdf",
    "qwerty",
    "xxx",
    "xxxx",
    "abc",
    "aaaa",
  ];

  if (
    blockedNames.includes(
      lettersOnly
    )
  ) {
    return `Įveskite tikrą ${fieldName.toLowerCase()}.`;
  }

  return null;
}

function normalizePhone(
  value: string
) {
  return value.replace(
    /[\s()-]/g,
    ""
  );
}

function validatePhone(
  value: string
) {
  const phone =
    normalizePhone(value);

  const phonePattern =
    /^\+[1-9]\d{7,14}$/;

  if (
    !phonePattern.test(phone)
  ) {
    return "Telefono numerį įveskite tarptautiniu formatu, pvz. +37061234567 arba +4791234567.";
  }

  return null;
}

function validateEmail(
  value: string
) {
  if (!value) {
    return null;
  }

  if (
    value.length > 180 ||
    value.includes(" ") ||
    value.includes("..")
  ) {
    return "Neteisingas el. pašto adresas.";
  }

  const parts =
    value.split("@");

  if (parts.length !== 2) {
    return "Neteisingas el. pašto adresas.";
  }

  const [localPart, domain] =
    parts;

  if (
    !localPart ||
    !domain ||
    localPart.startsWith(".") ||
    localPart.endsWith(".")
  ) {
    return "Neteisingas el. pašto adresas.";
  }

  const emailPattern =
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (
    !emailPattern.test(value)
  ) {
    return "Neteisingas el. pašto adresas.";
  }

  return null;
}

function sanitizeFileName(
  fileName: string
) {
  const parts =
    fileName.split(".");

  const extension =
    parts.length > 1
      ? parts
          .pop()
          ?.toLowerCase() ||
        ""
      : "";

  const baseName = parts
    .join(".")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    )
    .replace(/_+/g, "_")
    .slice(0, 80);

  return extension
    ? `${
        baseName || "cv"
      }.${extension}`
    : baseName || "cv";
}

function getClientIp(
  request: NextRequest
) {
  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  return (
    request.headers.get(
      "x-real-ip"
    ) || "unknown"
  );
}

function hashIp(
  ip: string,
  secret: string
) {
  return createHmac(
    "sha256",
    secret
  )
    .update(ip)
    .digest("hex");
}

function getRateLimitWindowStart() {
  const windowMs =
    RATE_LIMIT_MINUTES *
    60 *
    1000;

  const timestamp =
    Math.floor(
      Date.now() / windowMs
    ) * windowMs;

  return new Date(
    timestamp
  ).toISOString();
}

async function verifyTurnstile(
  token: string,
  ip: string,
  secretKey: string
) {
  const body =
    new URLSearchParams();

  body.append(
    "secret",
    secretKey
  );

  body.append(
    "response",
    token
  );

  if (
    ip &&
    ip !== "unknown"
  ) {
    body.append(
      "remoteip",
      ip
    );
  }

  const response =
    await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body,

        cache: "no-store",
      }
    );

  if (!response.ok) {
    return {
      success: false,
      hostname: "",
    };
  }

  const result =
    await response.json();

  return {
    success:
      result.success === true,

    hostname:
      typeof result.hostname ===
      "string"
        ? result.hostname
        : "",
  };
}

export async function POST(
  request: NextRequest
) {
  let uploadedCvPath:
    | string
    | null = null;

  try {
    const supabaseUrl =
      process.env
        .NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY;

    const turnstileSecret =
      process.env
        .TURNSTILE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !turnstileSecret
    ) {
      console.error(
        "Trūksta serverio aplinkos kintamųjų."
      );

      return NextResponse.json(
        {
          error:
            "Serverio konfigūracijos klaida.",
        },
        {
          status: 500,
        }
      );
    }

    const formData =
      await request.formData();

    const website =
      cleanText(
        formData.get(
          "website"
        ),
        200
      );

    if (website) {
      return NextResponse.json({
        success: true,
      });
    }

    const clientIp =
      getClientIp(request);

    const turnstileToken =
      cleanText(
        formData.get(
          "turnstileToken"
        ),
        3000
      );

    if (!turnstileToken) {
      return NextResponse.json(
        {
          error:
            "Nepavyko patvirtinti, kad nesate robotas. Bandykite dar kartą.",
        },
        {
          status: 400,
        }
      );
    }

    const turnstile =
      await verifyTurnstile(
        turnstileToken,
        clientIp,
        turnstileSecret
      );

    if (
      !turnstile.success
    ) {
      return NextResponse.json(
        {
          error:
            "Apsaugos patikrinimas nepavyko. Atnaujinkite puslapį ir bandykite dar kartą.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      process.env.NODE_ENV ===
        "production" &&
      turnstile.hostname &&
      turnstile.hostname !==
        "www.norgeworkis.lt" &&
      turnstile.hostname !==
        "norgeworkis.lt"
    ) {
      return NextResponse.json(
        {
          error:
            "Netinkamas apsaugos patikrinimas.",
        },
        {
          status: 403,
        }
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            persistSession:
              false,

            autoRefreshToken:
              false,
          },
        }
      );

    const ipHash =
      hashIp(
        clientIp,
        serviceRoleKey
      );

    const windowStart =
      getRateLimitWindowStart();

    const {
      data: rateLimitData,
      error: rateLimitError,
    } = await supabase.rpc(
      "check_registration_rate_limit",
      {
        p_ip_hash:
          ipHash,

        p_window_start:
          windowStart,

        p_max_requests:
          RATE_LIMIT_MAX_REQUESTS,
      }
    );

    if (rateLimitError) {
      console.error(
        "Rate limit klaida:",
        rateLimitError.message
      );

      return NextResponse.json(
        {
          error:
            "Laikina apsaugos sistemos klaida. Bandykite vėliau.",
        },
        {
          status: 503,
        }
      );
    }

    const rateLimitResult =
      Array.isArray(
        rateLimitData
      )
        ? rateLimitData[0]
        : rateLimitData;

    if (
      !rateLimitResult ||
      rateLimitResult.allowed !==
        true
    ) {
      return NextResponse.json(
        {
          error:
            "Per daug kandidatūros pateikimo bandymų. Palaukite maždaug 15 minučių ir bandykite dar kartą.",
        },
        {
          status: 429,
        }
      );
    }

    const vardas =
      cleanText(
        formData.get(
          "vardas"
        ),
        80
      );

    const pavarde =
      cleanText(
        formData.get(
          "pavarde"
        ),
        100
      );

    const telefonasRaw =
      cleanText(
        formData.get(
          "telefonas"
        ),
        40
      );

    const telefonas =
      normalizePhone(
        telefonasRaw
      );

    const email =
      cleanText(
        formData.get(
          "email"
        ),
        180
      ).toLowerCase();

    const profesija =
      cleanText(
        formData.get(
          "profesija"
        ),
        100
      );

    const patirtis =
      cleanText(
        formData.get(
          "patirtis"
        ),
        100
      );

    const norveguKalba =
      cleanText(
        formData.get(
          "norveguKalba"
        ),
        100
      );

    const angluKalba =
      cleanText(
        formData.get(
          "angluKalba"
        ),
        100
      );

    const apie =
      cleanText(
        formData.get(
          "apie"
        ),
        3000
      );

    const darbasIdRaw =
      cleanText(
        formData.get(
          "darbasId"
        ),
        30
      );

    const vardasError =
      validateName(
        vardas,
        "Vardas"
      );

    if (vardasError) {
      return NextResponse.json(
        {
          error:
            vardasError,
        },
        {
          status: 400,
        }
      );
    }

    if (pavarde) {
      const pavardeError =
        validateName(
          pavarde,
          "Pavardė"
        );

      if (pavardeError) {
        return NextResponse.json(
          {
            error:
              pavardeError,
          },
          {
            status: 400,
          }
        );
      }
    }

    const telefonasError =
      validatePhone(
        telefonas
      );

    if (telefonasError) {
      return NextResponse.json(
        {
          error:
            telefonasError,
        },
        {
          status: 400,
        }
      );
    }

    const emailError =
      validateEmail(email);

    if (emailError) {
      return NextResponse.json(
        {
          error:
            emailError,
        },
        {
          status: 400,
        }
      );
    }

    if (!profesija) {
      return NextResponse.json(
        {
          error:
            "Pasirinkite profesiją.",
        },
        {
          status: 400,
        }
      );
    }

    if (!patirtis) {
      return NextResponse.json(
        {
          error:
            "Pasirinkite darbo patirtį.",
        },
        {
          status: 400,
        }
      );
    }

    let darbasId:
      | number
      | null = null;

    if (darbasIdRaw) {
      const parsedId =
        Number(
          darbasIdRaw
        );

      if (
        !Number.isInteger(
          parsedId
        ) ||
        parsedId <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Neteisingas darbo pasiūlymas.",
          },
          {
            status: 400,
          }
        );
      }

      const {
        data: darbas,
        error: darbasError,
      } = await supabase
        .from("darbai")
        .select("id")
        .eq(
          "id",
          parsedId
        )
        .eq(
          "aktyvus",
          true
        )
        .maybeSingle();

      if (darbasError) {
        console.error(
          "Darbo tikrinimo klaida:",
          darbasError.message
        );

        return NextResponse.json(
          {
            error:
              "Nepavyko patikrinti darbo pasiūlymo.",
          },
          {
            status: 500,
          }
        );
      }

      if (!darbas) {
        return NextResponse.json(
          {
            error:
              "Šis darbo pasiūlymas nebėra aktyvus.",
          },
          {
            status: 400,
          }
        );
      }

      darbasId =
        parsedId;
    }

    const cvEntry =
      formData.get("cv");

    let cvPath:
      | string
      | null = null;

    if (
      cvEntry instanceof
        File &&
      cvEntry.size > 0
    ) {
      if (
        cvEntry.size >
        MAX_CV_SIZE
      ) {
        return NextResponse.json(
          {
            error:
              "CV failas negali būti didesnis nei 10 MB.",
          },
          {
            status: 400,
          }
        );
      }

      const extension =
        cvEntry.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "";

      if (
        !ALLOWED_CV_EXTENSIONS.includes(
          extension
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Leidžiami tik PDF, DOC arba DOCX failai.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        cvEntry.type &&
        !ALLOWED_CV_TYPES.includes(
          cvEntry.type
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Netinkamas CV failo formatas.",
          },
          {
            status: 400,
          }
        );
      }

      const safeName =
        sanitizeFileName(
          cvEntry.name
        );

      const randomPart =
        crypto.randomUUID();

      cvPath =
        `${randomPart}-${safeName}`;

      const fileBuffer =
        await cvEntry.arrayBuffer();

      const {
        error: uploadError,
      } = await supabase
        .storage
        .from("cv")
        .upload(
          cvPath,
          fileBuffer,
          {
            contentType:
              cvEntry.type ||
              "application/octet-stream",

            cacheControl:
              "3600",

            upsert:
              false,
          }
        );

      if (uploadError) {
        console.error(
          "CV įkėlimo klaida:",
          uploadError.message
        );

        return NextResponse.json(
          {
            error:
              "Nepavyko įkelti CV.",
          },
          {
            status: 500,
          }
        );
      }

      uploadedCvPath =
        cvPath;
    }

    const {
      error: insertError,
    } = await supabase
      .from("kandidatai")
      .insert({
        vardas,

        pavarde:
          pavarde || "",

        telefonas,

        email:
          email || "",

        profesija,
        patirtis,

        norvegu_kalba:
          norveguKalba ||
          "",

        anglu_kalba:
          angluKalba ||
          "",

        apie:
          apie || null,

        cv_path:
          cvPath,

        statusas:
          "Naujas",

        darbas_id:
          darbasId,
      });

    if (insertError) {
      if (uploadedCvPath) {
        await supabase
          .storage
          .from("cv")
          .remove([
            uploadedCvPath,
          ]);
      }

      console.error(
        "Kandidato įrašymo klaida:",
        insertError.message
      );

      return NextResponse.json(
        {
          error:
            "Nepavyko pateikti kandidatūros.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Kandidatūra sėkmingai pateikta.",
    });
  } catch (error) {
    console.error(
      "Registracijos API klaida:",
      error instanceof Error
        ? error.message
        : "Nežinoma klaida"
    );

    return NextResponse.json(
      {
        error:
          "Nepavyko pateikti kandidatūros. Bandykite dar kartą.",
      },
      {
        status: 500,
      }
    );
  }
}