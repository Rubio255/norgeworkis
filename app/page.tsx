"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Car,
  Clock3,
  Home,
  Languages,
  MapPin,
  Plane,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { createClient } from "../utils/supabase/client";
import LegalFooter from "./components/LegalFooter";

type Darbas = {
  id: number;
  pavadinimas: string;
  miestas: string;
  atlyginimas: string | null;
  aprasymas: string | null;
  aktyvus: boolean;

  grafikas: string | null;
  rotacija: string | null;
  apgyvendinimas: string | null;
  kelione: string | null;
  patirtis_reikalavimas: string | null;
  kalba_reikalavimas: string | null;
  vairuotojo_pazymejimas: string | null;
  darbo_pradzia: string | null;
};

function NorgeworkisLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        <ShieldCheck
          className="h-7 w-7 text-slate-900"
          strokeWidth={1.8}
        />
      </div>

      <div>
        <div className="text-2xl font-black tracking-[0.08em] text-white">
          NORGEWORKIS
        </div>

        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          Darbai Norvegijoje
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-500">
          {label}
        </div>

        <div className="mt-0.5 text-slate-800">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [supabase] = useState(() => createClient());

  const [darbai, setDarbai] = useState<Darbas[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadJobs() {
      const { data, error } = await supabase
        .from("darbai")
        .select("*")
        .eq("aktyvus", true)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(
          `Nepavyko gauti darbo pasiūlymų: ${error.message}`
        );

        setLoading(false);
        return;
      }

      setDarbai((data || []) as Darbas[]);
      setLoading(false);
    }

    loadJobs();
  }, [supabase]);

  return (
    <>
      <main className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-800 bg-slate-950">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/">
              <NorgeworkisLogo />
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="#darbai"
                className="text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Darbo pasiūlymai
              </Link>

              <Link
                href="/registracija"
                className="text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Kandidatams
              </Link>
            </nav>
          </div>
        </header>

        <section className="bg-slate-950 px-6 py-20 text-white">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_0.6fr] md:items-center">
            <div>
              <div className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                <BriefcaseBusiness
                  className="h-5 w-5"
                  strokeWidth={1.8}
                />

                Darbas Norvegijoje
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                Patikimesnis kelias į darbą Norvegijoje
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                Darbo pasiūlymai Lietuvos specialistams, kandidatų
                registracija ir aiškus kandidatūros pateikimo procesas.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="#darbai"
                  className="rounded-lg bg-white px-7 py-4 font-bold text-slate-950 transition hover:bg-slate-200"
                >
                  Peržiūrėti darbo pasiūlymus
                </Link>

                <Link
                  href="/registracija"
                  className="rounded-lg border border-slate-600 px-7 py-4 font-bold text-white transition hover:border-slate-400 hover:bg-slate-900"
                >
                  Registruotis kandidatui
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                  <BriefcaseBusiness
                    className="h-6 w-6 text-white"
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Aiškus kandidatavimo procesas
                  </h2>

                  <p className="mt-2 leading-7 text-slate-400">
                    Pasirinkite tinkamą poziciją, pateikite kandidatūrą ir
                    laukite informacijos apie tolimesnius atrankos žingsnius.
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-slate-800 pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                    <Building2
                      className="h-6 w-6 text-white"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Darbdaviai Norvegijoje
                    </h2>

                    <p className="mt-2 leading-7 text-slate-400">
                      Kandidatūros gali būti pateikiamos potencialiems
                      darbdaviams pagal pasirinktą darbo poziciją.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="darbai"
          className="mx-auto max-w-6xl px-6 py-16"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Naujausi pasiūlymai
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              Darbo pasiūlymai
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Peržiūrėkite aktyvias pozicijas, darbo sąlygas ir pateikite
              kandidatūrą tiesiai į pasirinktą darbo pasiūlymą.
            </p>
          </div>

          {loading && (
            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              Kraunami darbo pasiūlymai...
            </div>
          )}

          {errorMessage && (
            <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
              {errorMessage}
            </div>
          )}

          {!loading &&
            !errorMessage &&
            darbai.length === 0 && (
              <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                Šiuo metu aktyvių darbo pasiūlymų nėra.
              </div>
            )}

          <div className="mt-10 space-y-8">
            {darbai.map((darbas) => (
              <article
                key={darbas.id}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <BriefcaseBusiness
                          className="h-6 w-6 text-slate-700"
                          strokeWidth={1.8}
                        />
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Norvegija
                      </span>
                    </div>

                    <h3 className="mt-5 text-3xl font-bold text-slate-900">
                      {darbas.pavadinimas}
                    </h3>
                  </div>

                  {darbas.atlyginimas && (
                    <div className="rounded-xl bg-slate-900 px-5 py-3 text-white">
                      <div className="flex items-center gap-2">
                        <Banknote
                          className="h-5 w-5"
                          strokeWidth={1.8}
                        />

                        <span className="font-bold">
                          {darbas.atlyginimas}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-3 border-b border-slate-200 pb-6 text-slate-700">
                  <MapPin
                    className="h-5 w-5 shrink-0 text-slate-500"
                    strokeWidth={1.8}
                  />

                  <span className="font-semibold">
                    {darbas.miestas}, Norvegija
                  </span>
                </div>

                <div className="mt-7 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoRow
                    icon={
                      <Clock3
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Darbo grafikas"
                    value={darbas.grafikas}
                  />

                  <InfoRow
                    icon={
                      <CalendarDays
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Rotacija"
                    value={darbas.rotacija}
                  />

                  <InfoRow
                    icon={
                      <Home
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Apgyvendinimas"
                    value={darbas.apgyvendinimas}
                  />

                  <InfoRow
                    icon={
                      <Plane
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Kelionė"
                    value={darbas.kelione}
                  />

                  <InfoRow
                    icon={
                      <UserRoundCheck
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Reikalaujama patirtis"
                    value={darbas.patirtis_reikalavimas}
                  />

                  <InfoRow
                    icon={
                      <Languages
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Kalbos"
                    value={darbas.kalba_reikalavimas}
                  />

                  <InfoRow
                    icon={
                      <Car
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Vairuotojo pažymėjimas"
                    value={darbas.vairuotojo_pazymejimas}
                  />

                  <InfoRow
                    icon={
                      <CalendarDays
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    }
                    label="Darbo pradžia"
                    value={darbas.darbo_pradzia}
                  />
                </div>

                {darbas.aprasymas && (
                  <div className="mt-8 border-t border-slate-200 pt-7">
                    <h4 className="text-lg font-bold text-slate-900">
                      Darbo aprašymas
                    </h4>

                    <p className="mt-3 whitespace-pre-wrap leading-8 text-slate-600">
                      {darbas.aprasymas}
                    </p>
                  </div>
                )}

                <div className="mt-8">
                  <Link
                    href={`/registracija?darbas=${darbas.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-slate-700"
                  >
                    Pateikti kandidatūrą
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-6 py-14">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <div>
              <BriefcaseBusiness
                className="h-7 w-7 text-slate-700"
                strokeWidth={1.8}
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Atrinkti pasiūlymai
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Aktualios darbo pozicijos pagal darbdavių poreikį.
              </p>
            </div>

            <div>
              <Building2
                className="h-7 w-7 text-slate-700"
                strokeWidth={1.8}
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Kandidatams nemokama
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Kandidatūros pateikimas platformoje yra nemokamas.
              </p>
            </div>

            <div>
              <MapPin
                className="h-7 w-7 text-slate-700"
                strokeWidth={1.8}
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Konkrečios pozicijos
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Kandidatuojama tiesiai į pasirinktą darbo pasiūlymą.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LegalFooter />
    </>
  );
}