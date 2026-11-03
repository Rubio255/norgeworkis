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
  House,
  Languages,
  MapPin,
  Plane,
  UserRoundCheck,
} from "lucide-react";

import { createClient } from "../utils/supabase/client";
import LegalFooter from "./components/LegalFooter";
import NorgeworkisLogo from "./components/NorgeworkisLogo";

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

  video_url: string | null;
};

function DetailCard({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  variant:
    | "blue"
    | "violet"
    | "green"
    | "orange"
    | "slate"
    | "cyan";
}) {
  if (!value) {
    return null;
  }

  const styles = {
    blue: {
      wrapper: "border-blue-200 bg-blue-50",
      icon: "text-blue-600",
      label: "text-blue-700",
    },

    violet: {
      wrapper: "border-violet-200 bg-violet-50",
      icon: "text-violet-600",
      label: "text-violet-700",
    },

    green: {
      wrapper: "border-emerald-200 bg-emerald-50",
      icon: "text-emerald-600",
      label: "text-emerald-700",
    },

    orange: {
      wrapper: "border-orange-200 bg-orange-50",
      icon: "text-orange-600",
      label: "text-orange-700",
    },

    slate: {
      wrapper: "border-slate-200 bg-slate-50",
      icon: "text-slate-600",
      label: "text-slate-600",
    },

    cyan: {
      wrapper: "border-cyan-200 bg-cyan-50",
      icon: "text-cyan-600",
      label: "text-cyan-700",
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`rounded-2xl border p-4 ${current.wrapper}`}
    >
      <div className={current.icon}>
        {icon}
      </div>

      <p
        className={`mt-3 text-xs font-black uppercase tracking-wider ${current.label}`}
      >
        {label}
      </p>

      <p className="mt-1 font-bold leading-6 text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function Home() {
  const [supabase] = useState(() =>
    createClient()
  );

  const [darbai, setDarbai] =
    useState<Darbas[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    async function loadJobs() {
      const { data, error } =
        await supabase
          .from("darbai")
          .select("*")
          .eq("aktyvus", true)
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        setErrorMessage(
          `Nepavyko gauti darbo pasiūlymų: ${error.message}`
        );

        setLoading(false);
        return;
      }

      setDarbai(
        (data || []) as Darbas[]
      );

      setLoading(false);
    }

    loadJobs();
  }, [supabase]);

  const pagrindinisDarbas =
    darbai.length > 0
      ? darbai[0]
      : null;

  const pagrindineRegistracija =
    pagrindinisDarbas
      ? `/registracija?darbas=${pagrindinisDarbas.id}`
      : "/registracija";

  return (
    <>
      <main className="min-h-screen bg-slate-100">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <NorgeworkisLogo />

            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="#darbai"
                className="text-sm font-bold text-slate-700 transition hover:text-blue-700"
              >
                Darbo pasiūlymai
              </Link>

              <Link
                href={pagrindineRegistracija}
                className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
              >
                Kandidatuoti
              </Link>
            </nav>

            <Link
              href={pagrindineRegistracija}
              className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm md:hidden"
            >
              Kandidatuoti
            </Link>
          </div>
        </header>

        <section className="bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-300 sm:text-sm">
                  <BriefcaseBusiness
                    className="h-4 w-4"
                    strokeWidth={2}
                  />

                  Darbas Norvegijoje
                </span>
              </div>

              <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
                Statybų darbai Norvegijoje
              </h1>

              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:mt-5 sm:text-lg">
                Atlyginimas pagal patirtį ir kvalifikaciją.
              </p>
            </div>

            {pagrindinisDarbas?.video_url && (
              <div className="mx-auto mt-7 max-w-4xl overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl sm:mt-9">
                <video
                  src={pagrindinisDarbas.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  className="aspect-video w-full object-cover"
                />
              </div>
            )}

            <div className="mx-auto mt-6 max-w-4xl">
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-center">
                <p className="font-black text-emerald-300">
                  Kandidatūra per 1 minutę
                </p>
              </div>

              <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                <Link
                  href={pagrindineRegistracija}
                  className="flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-center text-lg font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                >
                  Kandidatuoti dabar
                </Link>

                <Link
                  href="#darbai"
                  className="flex items-center justify-center rounded-2xl border border-slate-600 bg-slate-900 px-8 py-4 text-center font-bold text-white transition hover:border-slate-400 hover:bg-slate-800"
                >
                  Žiūrėti darbo pasiūlymą
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="darbai"
          className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16"
        >
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
              Darbo pasiūlymai
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Raskite sau tinkamą poziciją
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Pasirinkite darbo pasiūlymą ir pateikite kandidatūrą.
            </p>
          </div>

          {loading && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600 sm:mt-10">
              Kraunami darbo pasiūlymai...
            </div>
          )}

          {errorMessage && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 sm:mt-10">
              {errorMessage}
            </div>
          )}

          {!loading &&
            !errorMessage &&
            darbai.length === 0 && (
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600 sm:mt-10">
                Šiuo metu aktyvių darbo pasiūlymų nėra.
              </div>
            )}

          <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
            {darbai.map(
              (darbas, index) => (
                <article
                  key={darbas.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <BriefcaseBusiness
                              className="h-6 w-6"
                              strokeWidth={2}
                            />
                          </div>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700">
                            Norvegija
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
                          {darbas.pavadinimas}
                        </h3>

                        <div className="mt-4 flex items-center gap-2 text-slate-700">
                          <MapPin
                            className="h-5 w-5 text-blue-600"
                            strokeWidth={2}
                          />

                          <span className="font-bold">
                            {darbas.miestas}, Norvegija
                          </span>
                        </div>
                      </div>

                      {darbas.atlyginimas && (
                        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 shadow-sm">
                          <p className="text-xs font-black uppercase tracking-wider text-amber-700">
                            Atlyginimas
                          </p>

                          <div className="mt-1 flex items-center gap-2">
                            <Banknote
                              className="h-6 w-6 text-amber-600"
                              strokeWidth={2}
                            />

                            <span className="text-xl font-black text-slate-950 sm:text-2xl">
                              {darbas.atlyginimas}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-medium text-slate-600">
                            Pagal patirtį ir kvalifikaciją
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 sm:hidden">
                      <Link
                        href={`/registracija?darbas=${darbas.id}`}
                        className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-lg font-black text-white shadow-md transition hover:bg-blue-700"
                      >
                        Kandidatuoti dabar
                      </Link>
                    </div>

                    {index !== 0 &&
                      darbas.video_url && (
                        <div className="mt-6 overflow-hidden rounded-2xl bg-black shadow-sm">
                          <video
                            src={darbas.video_url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            preload="metadata"
                            className="aspect-video w-full object-cover"
                          />
                        </div>
                      )}

                    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailCard
                        icon={
                          <Clock3
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Grafikas"
                        value={darbas.grafikas}
                        variant="blue"
                      />

                      <DetailCard
                        icon={
                          <CalendarDays
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Rotacija"
                        value={darbas.rotacija}
                        variant="violet"
                      />

                      <DetailCard
                        icon={
                          <House
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Apgyvendinimas"
                        value={
                          darbas.apgyvendinimas
                        }
                        variant="green"
                      />

                      <DetailCard
                        icon={
                          <Plane
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Kelionė"
                        value={darbas.kelione}
                        variant="orange"
                      />

                      <DetailCard
                        icon={
                          <UserRoundCheck
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Patirtis"
                        value={
                          darbas.patirtis_reikalavimas
                        }
                        variant="cyan"
                      />

                      <DetailCard
                        icon={
                          <Languages
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Kalbos"
                        value={
                          darbas.kalba_reikalavimas
                        }
                        variant="blue"
                      />

                      <DetailCard
                        icon={
                          <Car
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Vairuotojo pažymėjimas"
                        value={
                          darbas.vairuotojo_pazymejimas
                        }
                        variant="slate"
                      />

                      <DetailCard
                        icon={
                          <CalendarDays
                            className="h-5 w-5"
                            strokeWidth={2}
                          />
                        }
                        label="Darbo pradžia"
                        value={
                          darbas.darbo_pradzia
                        }
                        variant="green"
                      />
                    </div>

                    {darbas.aprasymas && (
                      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                        <h4 className="text-lg font-black text-slate-900">
                          Darbo aprašymas
                        </h4>

                        <p className="mt-3 whitespace-pre-wrap leading-8 text-slate-600">
                          {darbas.aprasymas}
                        </p>
                      </div>
                    )}

                    <div className="mt-8 hidden sm:block">
                      <Link
                        href={`/registracija?darbas=${darbas.id}`}
                        className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-black text-white shadow-md transition hover:bg-blue-700"
                      >
                        Kandidatuoti dabar
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                <BriefcaseBusiness
                  className="h-6 w-6 text-blue-700"
                  strokeWidth={2}
                />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                Įvairios statybų pozicijos
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Atraskite darbą pagal savo patirtį ir specializaciją.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                <Building2
                  className="h-6 w-6 text-emerald-700"
                  strokeWidth={2}
                />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                Greitas kontaktas
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Pateikite kandidatūrą ir su jumis susisieksime.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                <MapPin
                  className="h-6 w-6 text-amber-700"
                  strokeWidth={2}
                />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                Trumpa registracija
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Keli žingsniai ir kandidatūra pateikta.
              </p>
            </div>
          </div>
        </section>
      </main>

      <LegalFooter />
    </>
  );
}