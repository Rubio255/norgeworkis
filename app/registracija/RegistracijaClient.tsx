"use client";

import Link from "next/link";
import Script from "next/script";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

type Darbas = {
  id: number;
  pavadinimas: string;
  miestas: string;
  atlyginimas: string | null;
  aprasymas: string | null;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;

    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;

      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

function validateName(
  value: string,
  fieldName: string
) {
  const name = value.trim();

  if (name.length < 2) {
    return `${fieldName} turi būti bent 2 raidžių.`;
  }

  if (name.length > 50) {
    return `${fieldName} per ilgas.`;
  }

  const namePattern =
    /^[\p{L}][\p{L}'’ -]*[\p{L}]$/u;

  if (!namePattern.test(name)) {
    return `${fieldName} gali būti sudarytas tik iš raidžių, tarpų, brūkšnelio arba apostrofo.`;
  }

  const lettersOnly = name
    .toLocaleLowerCase("lt-LT")
    .replace(/[^\p{L}]/gu, "");

  if (
    lettersOnly.length >= 3 &&
    new Set(lettersOnly).size === 1
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

  if (!phone) {
    return "Įveskite telefono numerį.";
  }

  const phonePattern =
    /^\+[1-9]\d{7,14}$/;

  if (!phonePattern.test(phone)) {
    return "Neteisingas telefono numeris. Naudokite tarptautinį formatą, pvz. +37061234567.";
  }

  return null;
}

function validateEmail(
  value: string
) {
  const email =
    value.trim().toLowerCase();

  if (!email) {
    return "Įveskite el. pašto adresą.";
  }

  if (
    email.length > 180 ||
    email.includes(" ") ||
    email.includes("..")
  ) {
    return "Neteisingas el. pašto adresas.";
  }

  const parts =
    email.split("@");

  if (parts.length !== 2) {
    return "Neteisingas el. pašto adresas.";
  }

  const [localPart, domain] =
    parts;

  if (
    !localPart ||
    !domain ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".")
  ) {
    return "Neteisingas el. pašto adresas.";
  }

  const emailPattern =
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (
    !emailPattern.test(email)
  ) {
    return "Neteisingas el. pašto adresas.";
  }

  return null;
}

export default function RegistracijaClient() {
  const searchParams =
    useSearchParams();

  const [supabase] =
    useState(() =>
      createClient()
    );

  const darbasIdParam =
    searchParams.get("darbas");

  const darbasId =
    darbasIdParam
      ? Number(darbasIdParam)
      : null;

  const [darbas, setDarbas] =
    useState<Darbas | null>(
      null
    );

  const [
    darbasLoading,
    setDarbasLoading,
  ] = useState(false);

  const [vardas, setVardas] =
    useState("");

  const [pavarde, setPavarde] =
    useState("");

  const [
    telefonas,
    setTelefonas,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [
    profesija,
    setProfesija,
  ] = useState("");

  const [
    patirtis,
    setPatirtis,
  ] = useState("");

  const [
    norveguKalba,
    setNorveguKalba,
  ] = useState("");

  const [
    angluKalba,
    setAngluKalba,
  ] = useState("");

  const [apie, setApie] =
    useState("");

  const [cv, setCv] =
    useState<File | null>(
      null
    );

  const [
    sutinkuPrivatumas,
    setSutinkuPrivatumas,
  ] = useState(false);

  const [
    sutinkuPerdavimas,
    setSutinkuPerdavimas,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    turnstileToken,
    setTurnstileToken,
  ] = useState("");

  const [
    turnstileScriptLoaded,
    setTurnstileScriptLoaded,
  ] = useState(false);

  const turnstileContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const turnstileWidgetIdRef =
    useRef<string | null>(null);

  const siteKey =
    process.env
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    "";

  useEffect(() => {
    async function loadJob() {
      if (
        !darbasId ||
        Number.isNaN(darbasId)
      ) {
        setDarbas(null);
        return;
      }

      setDarbasLoading(true);

      const { data, error } =
        await supabase
          .from("darbai")
          .select(`
            id,
            pavadinimas,
            miestas,
            atlyginimas,
            aprasymas
          `)
          .eq("id", darbasId)
          .eq("aktyvus", true)
          .maybeSingle();

      if (error) {
        console.error(
          "Nepavyko gauti darbo pasiūlymo:",
          error
        );

        setDarbas(null);
      } else {
        setDarbas(data);
      }

      setDarbasLoading(false);
    }

    loadJob();
  }, [darbasId, supabase]);

  useEffect(() => {
    if (
      !turnstileScriptLoaded ||
      !siteKey ||
      !window.turnstile ||
      !turnstileContainerRef.current
    ) {
      return;
    }

    if (
      turnstileWidgetIdRef.current
    ) {
      return;
    }

    const widgetId =
      window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: siteKey,

          callback: (
            token: string
          ) => {
            setTurnstileToken(
              token
            );

            setErrorMessage("");
          },

          "expired-callback":
            () => {
              setTurnstileToken(
                ""
              );
            },

          "error-callback":
            () => {
              setTurnstileToken(
                ""
              );

              setErrorMessage(
                "Nepavyko atlikti apsaugos patikrinimo. Bandykite dar kartą."
              );
            },

          theme: "light",
        }
      );

    turnstileWidgetIdRef.current =
      widgetId;

    return () => {
      if (
        window.turnstile?.remove &&
        turnstileWidgetIdRef.current
      ) {
        window.turnstile.remove(
          turnstileWidgetIdRef.current
        );

        turnstileWidgetIdRef.current =
          null;
      }
    };
  }, [
    turnstileScriptLoaded,
    siteKey,
  ]);

  function resetTurnstile() {
    setTurnstileToken("");

    if (
      window.turnstile &&
      turnstileWidgetIdRef.current
    ) {
      window.turnstile.reset(
        turnstileWidgetIdRef.current
      );
    }
  }

  function validateCv(
    file: File
  ) {
    const maxSize =
      10 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {
      return "CV failas negali būti didesnis nei 10 MB.";
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
    ];

    if (
      !extension ||
      !allowedExtensions.includes(
        extension
      )
    ) {
      return "Leidžiami tik PDF, DOC arba DOCX failai.";
    }

    return null;
  }

  function handleCvChange(
    file: File | null
  ) {
    setErrorMessage("");

    if (!file) {
      setCv(null);
      return;
    }

    const validationError =
      validateCv(file);

    if (validationError) {
      setCv(null);

      setErrorMessage(
        validationError
      );

      return;
    }

    setCv(file);
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const vardasError =
      validateName(
        vardas,
        "Vardas"
      );

    if (vardasError) {
      setErrorMessage(
        vardasError
      );
      return;
    }

    if (pavarde.trim()) {
      const pavardeError =
        validateName(
          pavarde,
          "Pavardė"
        );

      if (pavardeError) {
        setErrorMessage(
          pavardeError
        );
        return;
      }
    }

    const telefonasError =
      validatePhone(
        telefonas
      );

    if (telefonasError) {
      setErrorMessage(
        telefonasError
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage(
        "Įveskite el. pašto adresą."
      );
      return;
    }

    const emailError =
      validateEmail(email);

    if (emailError) {
      setErrorMessage(
        emailError
      );
      return;
    }

    if (!profesija) {
      setErrorMessage(
        "Pasirinkite profesiją."
      );
      return;
    }

    if (!patirtis) {
      setErrorMessage(
        "Pasirinkite darbo patirtį."
      );
      return;
    }

    if (!sutinkuPrivatumas) {
      setErrorMessage(
        "Patvirtinkite, kad susipažinote su privatumo politika."
      );
      return;
    }

    if (!sutinkuPerdavimas) {
      setErrorMessage(
        "Patvirtinkite sutikimą dėl kandidatūros duomenų naudojimo."
      );
      return;
    }

    if (cv) {
      const cvError =
        validateCv(cv);

      if (cvError) {
        setErrorMessage(
          cvError
        );
        return;
      }
    }

    if (!siteKey) {
      setErrorMessage(
        "Apsaugos sistema nesukonfigūruota."
      );
      return;
    }

    if (!turnstileToken) {
      setErrorMessage(
        "Palaukite, kol bus atliktas apsaugos patikrinimas."
      );
      return;
    }

    setLoading(true);

    try {
      const form =
        e.currentTarget;

      const formData =
        new FormData();

      formData.append(
        "vardas",
        vardas.trim()
      );

      formData.append(
        "pavarde",
        pavarde.trim()
      );

      formData.append(
        "telefonas",
        normalizePhone(
          telefonas
        )
      );

      formData.append(
        "email",
        email
          .trim()
          .toLowerCase()
      );

      formData.append(
        "profesija",
        profesija
      );

      formData.append(
        "patirtis",
        patirtis
      );

      formData.append(
        "norveguKalba",
        norveguKalba
      );

      formData.append(
        "angluKalba",
        angluKalba
      );

      formData.append(
        "apie",
        apie.trim()
      );

      if (
        darbasId &&
        !Number.isNaN(
          darbasId
        )
      ) {
        formData.append(
          "darbasId",
          String(darbasId)
        );
      }

      if (cv) {
        formData.append(
          "cv",
          cv
        );
      }

      formData.append(
        "turnstileToken",
        turnstileToken
      );

      const honeypotInput =
        form.elements.namedItem(
          "website"
        ) as HTMLInputElement | null;

      formData.append(
        "website",
        honeypotInput?.value ||
          ""
      );

      const response =
        await fetch(
          "/api/registracija",
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Nepavyko pateikti kandidatūros."
        );
      }

      setSuccessMessage(
        "Kandidatūra sėkmingai pateikta."
      );

      if (
        typeof window !==
          "undefined" &&
        window.gtag
      ) {
        window.gtag(
          "event",
          "candidate_registration",
          {
            job_id:
              darbasId &&
              !Number.isNaN(
                darbasId
              )
                ? darbasId
                : undefined,
          }
        );
      }

      setVardas("");
      setPavarde("");
      setTelefonas("");
      setEmail("");
      setProfesija("");
      setPatirtis("");
      setNorveguKalba("");
      setAngluKalba("");
      setApie("");
      setCv(null);

      setSutinkuPrivatumas(
        false
      );

      setSutinkuPerdavimas(
        false
      );

      const fileInput =
        document.getElementById(
          "cv"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      if (honeypotInput) {
        honeypotInput.value =
          "";
      }

      resetTurnstile();

      window.location.assign(
        "/registracija-sekminga"
      );
    } catch (error) {
      console.error(
        "Kandidatūros pateikimo klaida:",
        error
      );

      if (
        error instanceof Error
      ) {
        setErrorMessage(
          error.message
        );
      } else {
        setErrorMessage(
          "Nepavyko pateikti kandidatūros. Bandykite dar kartą."
        );
      }

      resetTurnstile();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() =>
          setTurnstileScriptLoaded(
            true
          )
        }
      />

      <main className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <Link
              href="/"
              className="text-xl font-black tracking-wide text-slate-950"
            >
              NORGEWORKIS
            </Link>

            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-slate-950"
            >
              Darbo pasiūlymai
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-12">
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8 md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
                Kandidato anketa
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                Kandidatuokite į darbą Norvegijoje
              </h1>

              <div className="mt-4 rounded-xl bg-sky-50 p-4">
                <p className="font-bold text-slate-900">
                  Užpildymas trunka apie 1 minutę.
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Įveskite pagrindinę informaciją.
                  CV ir papildoma informacija nėra privalomi.
                </p>

                <p className="mt-2 font-bold text-sky-700">
                  Su jumis nedelsdami susisieksime.
                </p>
              </div>
            </div>

            {darbasLoading && (
              <div className="mt-6 rounded-xl bg-slate-100 p-5 text-slate-600">
                Kraunamas darbo pasiūlymas...
              </div>
            )}

            {!darbasLoading &&
              darbas && (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kandidatuojate į
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    {darbas.pavadinimas}
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {darbas.miestas}, Norvegija
                  </p>

                  {darbas.atlyginimas && (
                    <p className="mt-2 font-semibold text-slate-900">
                      {darbas.atlyginimas}
                    </p>
                  )}
                </div>
              )}

            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-6"
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-10000px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
              >
                <label htmlFor="website">
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Vardas *
                  </label>

                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    value={vardas}
                    onChange={(e) =>
                      setVardas(
                        e.target.value
                      )
                    }
                    autoComplete="given-name"
                    placeholder="Pvz. Jonas"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-sky-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Telefonas *
                  </label>

                  <input
                    type="tel"
                    required
                    value={telefonas}
                    onChange={(e) =>
                      setTelefonas(
                        e.target.value
                      )
                    }
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+37061234567"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  El. paštas *
                </label>

                <input
                  type="email"
                  required
                  minLength={5}
                  maxLength={180}
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                  inputMode="email"
                  placeholder="pvz. jonas@gmail.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Profesija *
                </label>

                <select
                  required
                  value={profesija}
                  onChange={(e) =>
                    setProfesija(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none focus:border-sky-600"
                >
                  <option value="">
                    Pasirinkite profesiją
                  </option>

                  <option value="Stalius">
                    Stalius
                  </option>

                  <option value="Betonuotojas">
                    Betonuotojas
                  </option>

                  <option value="Elektrikas">
                    Elektrikas
                  </option>

                  <option value="Suvirintojas">
                    Suvirintojas
                  </option>

                  <option value="Santechnikas">
                    Santechnikas
                  </option>

                  <option value="Dažytojas">
                    Dažytojas
                  </option>

                  <option value="Mechanikas">
                    Mechanikas
                  </option>

                  <option value="Vairuotojas">
                    Vairuotojas
                  </option>

                  <option value="Kita">
                    Kita
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Darbo patirtis *
                </label>

                <select
                  required
                  value={patirtis}
                  onChange={(e) =>
                    setPatirtis(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none focus:border-sky-600"
                >
                  <option value="">
                    Pasirinkite
                  </option>

                  <option value="Be patirties">
                    Be patirties
                  </option>

                  <option value="Iki 1 metų">
                    Iki 1 metų
                  </option>

                  <option value="1–3 metai">
                    1–3 metai
                  </option>

                  <option value="3–5 metai">
                    3–5 metai
                  </option>

                  <option value="Daugiau nei 5 metai">
                    Daugiau nei 5 metai
                  </option>
                </select>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <p className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Papildoma informacija – neprivaloma
                </p>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Pavardė
                  </label>

                  <input
                    type="text"
                    minLength={2}
                    maxLength={50}
                    value={pavarde}
                    onChange={(e) =>
                      setPavarde(
                        e.target.value
                      )
                    }
                    autoComplete="family-name"
                    placeholder="Pvz. Jonaitis"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-sky-600"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Norvegų kalba
                  </label>

                  <select
                    value={norveguKalba}
                    onChange={(e) =>
                      setNorveguKalba(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none focus:border-sky-600"
                  >
                    <option value="">
                      Nenurodyta
                    </option>
                    <option value="Nekalbu">
                      Nekalbu
                    </option>
                    <option value="Pagrindai">
                      Pagrindai
                    </option>
                    <option value="Vidutiniškai">
                      Vidutiniškai
                    </option>
                    <option value="Gerai">
                      Gerai
                    </option>
                    <option value="Laisvai">
                      Laisvai
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-slate-700">
                    Anglų kalba
                  </label>

                  <select
                    value={angluKalba}
                    onChange={(e) =>
                      setAngluKalba(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base outline-none focus:border-sky-600"
                  >
                    <option value="">
                      Nenurodyta
                    </option>
                    <option value="Nekalbu">
                      Nekalbu
                    </option>
                    <option value="Pagrindai">
                      Pagrindai
                    </option>
                    <option value="Vidutiniškai">
                      Vidutiniškai
                    </option>
                    <option value="Gerai">
                      Gerai
                    </option>
                    <option value="Laisvai">
                      Laisvai
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-700">
                  Trumpai apie save
                </label>

                <textarea
                  rows={4}
                  value={apie}
                  onChange={(e) =>
                    setApie(
                      e.target.value
                    )
                  }
                  placeholder="Patirtis, kvalifikacija ar kita svarbi informacija."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label
                  htmlFor="cv"
                  className="mb-2 block font-semibold text-slate-700"
                >
                  CV (neprivaloma)
                </label>

                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) =>
                    handleCvChange(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                />

                {cv && (
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    Pasirinktas failas: {cv.name}
                  </p>
                )}
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-6">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={
                      sutinkuPrivatumas
                    }
                    onChange={(e) =>
                      setSutinkuPrivatumas(
                        e.target.checked
                      )
                    }
                    className="mt-1 h-5 w-5 shrink-0"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    Patvirtinu, kad susipažinau su{" "}
                    <Link
                      href="/privatumo-politika"
                      target="_blank"
                      className="font-semibold text-sky-700 underline"
                    >
                      privatumo politika
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    checked={
                      sutinkuPerdavimas
                    }
                    onChange={(e) =>
                      setSutinkuPerdavimas(
                        e.target.checked
                      )
                    }
                    className="mt-1 h-5 w-5 shrink-0"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    Sutinku, kad mano pateikti kandidatūros duomenys ir,
                    jei pateiktas, CV būtų naudojami kandidatūros
                    administravimui ir galėtų būti perduoti potencialiems
                    darbdaviams dėl mano pasirinktos arba mano kvalifikaciją
                    atitinkančios darbo pozicijos.
                  </span>
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm text-slate-600">
                  Apsaugos nuo automatinių užklausų patikrinimas
                </p>

                {!siteKey ? (
                  <p className="text-sm font-semibold text-red-600">
                    Trūksta Turnstile Site Key.
                  </p>
                ) : (
                  <div
                    ref={
                      turnstileContainerRef
                    }
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !turnstileToken
                }
                className="w-full rounded-xl bg-slate-950 px-6 py-4 text-lg font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Siunčiama..."
                  : "Kandidatuoti dabar"}
              </button>

              <p className="text-center text-sm text-slate-500">
                Kandidatūros pateikimas kandidatui yra nemokamas.
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}