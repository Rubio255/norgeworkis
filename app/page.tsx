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
    <div className="flex items-start gap-2 rounded-xl bg-surface-2 p-3">
      <div className="mt-0.5 shrink-0 text-brand">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-muted">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold leading-5 text-fg">
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
      <main className="min-h-screen bg-page">
        <header className="sticky top-0 z-50 border-b border-line bg-surface/95 shadow-card backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <NorgeworkisLogo />

            <nav className="hidden items-center gap-7 md:flex">
              <Link
                href="#darbai"
                className="text-sm font-bold text-fg/80 transition hover:text-brand"
              >
                Darbo pasiūlymai
              </Link>

              <Link
                href={pagrindineRegistracija}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-accent-fg shadow-accent transition hover:bg-accent-hover"
              >
                Kandidatuoti
              </Link>
            </nav>

            <Link
              href={pagrindineRegistracija}
              className="rounded-full bg-accent px-4 py-2.5 text-sm font-extrabold text-accent-fg shadow-accent md:hidden"
            >
              Kandidatuoti
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden bg-ink text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:py-14">
            <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
              <div className="order-1">
                <div className="overflow-hidden rounded-[20px] border border-white/15 bg-black shadow-2xl">
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
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-accent-fg">
                  <BriefcaseBusiness
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                  Darbas Norvegijoje
                </span>

                <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Statybų darbai Norvegijoje
                </h1>

                <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                  Atlyginimas pagal patirtį ir kvalifikaciją.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-[20px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_4px_rgb(242_183_5/.25)]"
                  />

                  <p className="font-bold text-white">
                    Kandidatūra per 1 minutę
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={pagrindineRegistracija}
                    className="flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-center text-lg font-extrabold text-accent-fg shadow-accent transition hover:bg-accent-hover"
                  >
                    Kandidatuoti dabar
                  </Link>

                  <Link
                    href="#darbai"
                    className="flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-center text-lg font-bold text-white backdrop-blur transition hover:bg-white/20"
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
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand">
                Darbo pasiūlymai
              </p>

              <h2 className="mt-2 text-3xl font-bold text-fg">
                Pasirinkite tinkamą poziciją
              </h2>
            </div>

            {!loading && darbai.length > 0 && (
              <p className="text-sm font-semibold text-muted">
                Aktyvūs pasiūlymai: {darbai.length}
              </p>
            )}
          </div>

          {loading && (
            <div className="mt-7 rounded-[20px] border border-line bg-surface p-6 text-muted">
              Kraunami darbo pasiūlymai...
            </div>
          )}

          {errorMessage && (
            <div className="mt-7 rounded-[20px] border border-bad/30 bg-bad-bg p-6 font-semibold text-bad">
              {errorMessage}
            </div>
          )}

          {!loading &&
            !errorMessage &&
            darbai.length === 0 && (
              <div className="mt-7 rounded-[20px] border border-line bg-surface p-6 text-muted">
                Šiuo metu aktyvių darbo pasiūlymų nėra.
              </div>
            )}

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {darbai.map((darbas) => (
              <article
                key={darbas.id}
                className="flex h-full flex-col overflow-hidden rounded-[20px] bg-surface shadow-card transition hover:-translate-y-1 hover:shadow-card-lg"
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand-soft text-brand">
                      <BriefcaseBusiness
                        className="h-5 w-5"
                        strokeWidth={2}
                      />
                    </div>

                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.04em] text-brand">
                      Norvegija
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-7 text-fg">
                    {darbas.pavadinimas}
                  </h3>

                  <div className="mt-2 flex items-start gap-2 text-sm text-muted">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      strokeWidth={2}
                    />

                    <span className="font-semibold">
                      {darbas.miestas}, Norvegija
                    </span>
                  </div>

                  {darbas.atlyginimas && (
                    <div className="mt-4 rounded-xl border border-accent bg-accent-soft p-4">
                      <div className="flex items-center gap-2">
                        <Banknote
                          className="h-5 w-5 text-warn"
                          strokeWidth={2}
                        />

                        <span className="text-lg font-extrabold text-fg">
                          {darbas.atlyginimas}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-semibold text-warn">
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
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="max-h-24 overflow-hidden text-sm leading-6 text-muted">
                        {darbas.aprasymas}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {darbas.kalba_reikalavimas && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-info/25 bg-info-bg px-3 py-2 text-sm">
                        <Languages className="h-4 w-4 shrink-0 text-info" />

                        <span className="font-bold text-info">
                          Kalbos:
                        </span>

                        <span className="font-semibold text-info">
                          {darbas.kalba_reikalavimas}
                        </span>
                      </div>
                    )}

                    {darbas.vairuotojo_pazymejimas && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm">
                        <Car className="h-4 w-4 shrink-0 text-fg/80" />

                        <span className="font-bold text-fg">
                          Vairuotojo pažymėjimas:
                        </span>

                        <span className="font-semibold text-fg/80">
                          {darbas.vairuotojo_pazymejimas}
                        </span>
                      </div>
                    )}

                    {darbas.kelione && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-warn/25 bg-warn-bg px-3 py-2 text-sm">
                        <Plane className="h-4 w-4 shrink-0 text-warn" />

                        <span className="font-bold text-warn">
                          Kelionė:
                        </span>

                        <span className="font-semibold text-warn">
                          {darbas.kelione}
                        </span>
                      </div>
                    )}

                    {darbas.darbo_pradzia && (
                      <div className="inline-flex items-center gap-2 rounded-xl border border-ok/25 bg-ok-bg px-3 py-2 text-sm">
                        <CalendarDays className="h-4 w-4 shrink-0 text-ok" />

                        <span className="font-bold text-ok">
                          Darbo pradžia:
                        </span>

                        <span className="font-semibold text-ok">
                          {darbas.darbo_pradzia}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/registracija?darbas=${darbas.id}`}
                      className="flex w-full items-center justify-center rounded-full bg-accent px-5 py-3.5 font-extrabold text-accent-fg transition hover:bg-accent-hover shadow-accent"
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