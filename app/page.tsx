"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Banknote,
  BriefcaseBusiness,
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

function MiniDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
      <div className="mt-0.5 shrink-0 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-900">
          {value}
        </p>
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

      setDarbai((data || []) as Darbas[]);
      setLoading(false);
    }

    loadJobs();
  }, [supabase]);

  const pagrindinisDarbas =
    darbai.length > 0 ? darbai[0] : null;

  const pagrindineRegistracija = pagrindinisDarbas
    ? `/registracija?darbas=${pagrindinisDarbas.id}`
    : "/registracija";

  return (
    <>
      <main className="min-h-screen bg-slate-100">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <NorgeworkisLogo />

            <nav className="hidden items-center gap-7 md:flex">
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

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:py-12">
            <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
              <div className="order-1">
                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl">
                  <video
                    src="/videos/statybu-aikstele.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    className="pointer-events-none aspect-video w-full object-cover"
                  />
                </div>
              </div>

              <div className="order-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-300">
                  <BriefcaseBusiness
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                  Darbas Norvegijoje
                </span>

                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                  Statybų darbai Norvegijoje
                </h1>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  Atlyginimas pagal patirtį ir kvalifikaciją.
                </p>

                <div className="mt-5 inline-flex rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3">
                  <p className="font-black text-emerald-300">
                    Kandidatūra per 1 minutę
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={pagrindineRegistracija}
                    className="flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-center font-black text-white shadow-lg transition hover:bg-blue-500"
                  >
                    Kandidatuoti dabar
                  </Link>

                  <Link
                    href="#darbai"
                    className="flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900 px-7 py-3.5 text-center font-bold text-white transition hover:bg-slate-800"
                  >
                    Darbo pasiūlymai
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="darbai"
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">
                Darbo pasiūlymai
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Pasirinkite tinkamą poziciją
              </h2>
            </div>

            {!loading && darbai.length > 0 && (
              <p className="text-sm font-semibold text-slate-500">
                Aktyvūs pasiūlymai: {darbai.length}
              </p>
            )}
          </div>

          {loading && (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
              Kraunami darbo pasiūlymai...
            </div>
          )}

          {errorMessage && (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {!loading &&
            !errorMessage &&
            darbai.length === 0 && (
              <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                Šiuo metu aktyvių darbo pasiūlymų nėra.
              </div>
            )}

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {darbai.map((darbas) => (
              <article
                key={darbas.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <BriefcaseBusiness
                        className="h-5 w-5"
                        strokeWidth={2}
                      />
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-700">
                      Norvegija
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black leading-7 text-slate-950">
                    {darbas.pavadinimas}
                  </h3>

                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
                      strokeWidth={2}
                    />

                    <span className="font-semibold">
                      {darbas.miestas}, Norvegija
                    </span>
                  </div>

                  {darbas.atlyginimas && (
                    <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                      <div className="flex items-center gap-2">
                        <Banknote
                          className="h-5 w-5 text-amber-600"
                          strokeWidth={2}
                        />

                        <span className="text-lg font-black text-slate-950">
                          {darbas.atlyginimas}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-semibold text-amber-800">
                        Pagal patirtį ir kvalifikaciją
                      </p>
                    </div>
                  )}

                  <div className="mt-4 grid gap-2">
                    <MiniDetail
                      icon={
                        <Clock3
                          className="h-4 w-4"
                          strokeWidth={2}
                        />
                      }
                      label="Grafikas"
                      value={darbas.grafikas}
                    />

                    <MiniDetail
                      icon={
                        <CalendarDays
                          className="h-4 w-4"
                          strokeWidth={2}
                        />
                      }
                      label="Rotacija"
                      value={darbas.rotacija}
                    />

                    <MiniDetail
                      icon={
                        <House
                          className="h-4 w-4"
                          strokeWidth={2}
                        />
                      }
                      label="Apgyvendinimas"
                      value={darbas.apgyvendinimas}
                    />

                    <MiniDetail
                      icon={
                        <UserRoundCheck
                          className="h-4 w-4"
                          strokeWidth={2}
                        />
                      }
                      label="Patirtis"
                      value={darbas.patirtis_reikalavimas}
                    />
                  </div>

                  {darbas.aprasymas && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="max-h-24 overflow-hidden text-sm leading-6 text-slate-600">
                        {darbas.aprasymas}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {darbas.kalba_reikalavimas && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm">
                        <Languages className="h-4 w-4 shrink-0 text-cyan-700" />

                        <span className="font-bold text-cyan-900">
                          Kalbos:
                        </span>

                        <span className="font-semibold text-cyan-800">
                          {darbas.kalba_reikalavimas}
                        </span>
                      </div>
                    )}

                    {darbas.vairuotojo_pazymejimas && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm">
                        <Car className="h-4 w-4 shrink-0 text-slate-700" />

                        <span className="font-bold text-slate-900">
                          Vairuotojo pažymėjimas:
                        </span>

                        <span className="font-semibold text-slate-700">
                          {darbas.vairuotojo_pazymejimas}
                        </span>
                      </div>
                    )}

                    {darbas.kelione && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm">
                        <Plane className="h-4 w-4 shrink-0 text-orange-700" />

                        <span className="font-bold text-orange-900">
                          Kelionė:
                        </span>

                        <span className="font-semibold text-orange-800">
                          {darbas.kelione}
                        </span>
                      </div>
                    )}

                    {darbas.darbo_pradzia && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                        <CalendarDays className="h-4 w-4 shrink-0 text-emerald-700" />

                        <span className="font-bold text-emerald-900">
                          Darbo pradžia:
                        </span>

                        <span className="font-semibold text-emerald-800">
                          {darbas.darbo_pradzia}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/registracija?darbas=${darbas.id}`}
                      className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-black text-white transition hover:bg-blue-700"
                    >
                      Kandidatuoti
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <LegalFooter />
    </>
  );
}