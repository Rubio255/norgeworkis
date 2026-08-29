import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const kandidatIds = body.kandidatIds as number[];
    const darbdavioEmail = body.darbdavioEmail as string;

    if (!Array.isArray(kandidatIds) || kandidatIds.length === 0) {
      return NextResponse.json(
        {
          error: "Nepasirinkti kandidatai.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !darbdavioEmail ||
      typeof darbdavioEmail !== "string" ||
      !darbdavioEmail.includes("@")
    ) {
      return NextResponse.json(
        {
          error: "Nenurodytas teisingas darbdavio el. paštas.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD
    ) {
      return NextResponse.json(
        {
          error:
            "Serverio el. pašto nustatymai nėra pilnai sukonfigūruoti.",
        },
        {
          status: 500,
        }
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          error:
            "Serverio Supabase nustatymai nėra pilnai sukonfigūruoti.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * 1. Pasiimame pažymėtų kandidatų duomenis
     */

    const {
      data: kandidatai,
      error: kandidataiError,
    } = await supabase
      .from("kandidatai")
      .select(`
        id,
        vardas,
        pavarde,
        telefonas,
        email,
        profesija,
        patirtis,
        norvegu_kalba,
        anglu_kalba,
        apie,
        statusas,
        darbas_id
      `)
      .in("id", kandidatIds);

    if (kandidataiError) {
      console.error(
        "Kandidatų gavimo klaida:",
        kandidataiError
      );

      return NextResponse.json(
        {
          error:
            "Nepavyko gauti kandidatų: " +
            kandidataiError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!kandidatai || kandidatai.length === 0) {
      return NextResponse.json(
        {
          error: "Kandidatų nerasta.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * 2. Paruošiame Excel duomenis
     */

    const excelData = kandidatai.map(
      (kandidatas, index) => ({
        "Nr.": index + 1,

        Vardas:
          kandidatas.vardas || "",

        Pavardė:
          kandidatas.pavarde || "",

        Telefonas:
          kandidatas.telefonas || "",

        "El. paštas":
          kandidatas.email || "",

        Profesija:
          kandidatas.profesija || "",

        Patirtis:
          kandidatas.patirtis || "",

        "Norvegų kalba":
          kandidatas.norvegu_kalba || "",

        "Anglų kalba":
          kandidatas.anglu_kalba || "",

        "Apie kandidatą":
          kandidatas.apie || "",
      })
    );

    /*
     * 3. Sukuriame Excel lapą
     */

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    /*
     * Excel stulpelių plotis
     */

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 22 },
      { wch: 20 },
      { wch: 30 },
      { wch: 24 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 60 },
    ];

    /*
     * Sukuriame Excel failą
     */

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Kandidatai"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

    /*
     * 4. Paruošiame SMTP
     */

    const transporter =
      nodemailer.createTransport({
        host:
          process.env.SMTP_HOST ||
          "smtp.hostinger.com",

        port: Number(
          process.env.SMTP_PORT || 465
        ),

        secure:
          process.env.SMTP_SECURE ===
          "true",

        auth: {
          user:
            process.env.SMTP_USER,

          pass:
            process.env.SMTP_PASSWORD,
        },
      });

    /*
     * Patikriname SMTP prisijungimą
     */

    await transporter.verify();

    /*
     * 5. Sugeneruojame failo pavadinimą
     */

    const dabar = new Date();

    const dataFailui =
      dabar
        .toISOString()
        .slice(0, 10);

    const filename =
      `norgeworkis-kandidatai-${dataFailui}.xlsx`;

    /*
     * 6. Išsiunčiame laišką
     */

    await transporter.sendMail({
      from: `"Norgeworkis" <${process.env.SMTP_USER}>`,

      to: darbdavioEmail,

      subject:
        "Norgeworkis – atrinktų kandidatų sąrašas",

      text:
        "Sveiki,\n\n" +
        `Prisegame atrinktų kandidatų sąrašą (${kandidatai.length}).\n\n` +
        "Kandidatų informacija pateikta prisegtame Excel faile.\n\n" +
        "Pagarbiai,\n" +
        "Norgeworkis\n" +
        "www.norgeworkis.lt",

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Sveiki,</p>

          <p>
            Prisegame atrinktų kandidatų sąrašą.
          </p>

          <p>
            Kandidatų skaičius:
            <strong>${kandidatai.length}</strong>
          </p>

          <p>
            Kandidatų informacija pateikta
            prisegtame Excel faile.
          </p>

          <p>
            Pagarbiai,<br />
            <strong>Norgeworkis</strong><br />
            www.norgeworkis.lt
          </p>
        </div>
      `,

      attachments: [
        {
          filename,

          content: excelBuffer,

          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    /*
     * 7. Tik po sėkmingo laiško išsiuntimo
     * atnaujiname kandidatų statusus
     */

    const now =
      new Date().toISOString();

    const {
      error: updateError,
    } = await supabase
      .from("kandidatai")
      .update({
        statusas:
          "Išsiųstas darbdaviui",

        issiusta_darbdaviui_at:
          now,
      })
      .in("id", kandidatIds);

    /*
     * Jeigu laiškas išsiųstas,
     * bet statusų pakeisti nepavyko
     */

    if (updateError) {
      console.error(
        "Laiškas išsiųstas, bet nepavyko atnaujinti kandidatų statusų:",
        updateError
      );

      return NextResponse.json({
        success: true,

        warning:
          "Laiškas išsiųstas, tačiau kandidatų statusai nebuvo atnaujinti.",

        sentCount:
          kandidatai.length,
      });
    }

    /*
     * 8. Viskas sėkmingai
     */

    return NextResponse.json({
      success: true,

      message:
        `Sėkmingai išsiųsta ${kandidatai.length} kandidatų į ${darbdavioEmail}.`,

      sentCount:
        kandidatai.length,
    });
  } catch (error) {
    console.error(
      "Kandidatų siuntimo klaida:",
      error
    );

    let errorMessage =
      "Nepavyko išsiųsti laiško.";

    if (error instanceof Error) {
      errorMessage =
        error.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}