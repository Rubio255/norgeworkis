"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  Award,
  BedDouble,
  CalendarSync,
  CarFront,
  Clock3,
  Coins,
  HardHat,
  Languages,
  MapPinned,
  PlaneTakeoff,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
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
  orb,
  label,
  value,
}: {
  icon: React.ReactNode;
  orb: string;
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="group/detail flex items-center gap-3 rounded-2xl glass-soft p-2.5 transition hover:bg-surface/70">
      <div className={`orb ${orb} h-9 w-9 rounded-xl`}>
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

function Tag({
  icon,
  orb,
  label,
  value,
}: {
  icon: React.ReactNode;
  orb: string;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full glass-soft py-1 pl-1 pr-3 text-sm">
      <span className={`orb ${orb} h-7 w-7 rounded-full`}>
        {icon}
      </span>

      <span className="font-bold text-fg">{label}</span>

      <span className="font-semibold text-muted">{value}</span>
    </div>
  );
}

// Šviesa kortelėje seka pelės žymeklį
function trackPointer(event: React.MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();

  event.currentTarget.style.setProperty(
    "--mx",
    `${event.clientX - rect.left}px`
  );

  event.currentTarget.style.setProperty(
    "--my",
    `${event.clientY - rect.top}px`
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
      <main className="min-h-screen">
        <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
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
                className="shine rounded-full bg-accent px-5 py-2.5 text-sm font-extrabold text-accent-fg shadow-accent transition hover:-translate-y-0.5 hover:bg-accent-hover"
              >
                Kandidatuoti
              </Link>
            </nav>

            <Link
              href={pagrindineRegistracija}
              className="shine rounded-full bg-accent px-4 py-2.5 text-sm font-extrabold text-accent-fg shadow-accent md:hidden"
            >
              Kandidatuoti
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden bg-ink text-white">
          <div
            aria-hidden="true"
            className="float-slow pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#5fc2b4]/40 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="float pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-[#f2b705]/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgb(255_255_255)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12 lg:py-16">
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div className="reveal relative order-1">
                <div className="ring-glow shadow-2xl shadow-black/40">
                  <div className="overflow-hidden rounded-[20px] bg-black">
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

                <div className="float glass-dark glass-chip absolute -bottom-5 left-4 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex">
                  <span className="orb orb-gold h-10 w-10 rounded-xl">
                    <Coins className="h-5 w-5" strokeWidth={2.2} />
                  </span>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
                      Atlyginimas
                    </p>

                    <p className="font-bold">Pagal patirtį</p>
                  </div>
                </div>

                <div className="float-slow glass-dark glass-chip absolute -right-3 -top-4 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex">
                  <span className="orb orb-teal orb-spark h-10 w-10 rounded-xl">
                    <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
                  </span>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-white/60">
                      Kandidatams
                    </p>

                    <p className="font-bold">Nemokamai</p>
                  </div>
                </div>
              </div>

              <div className="order-2">
                <span
                  className="reveal glass-dark inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-4 text-xs font-bold uppercase tracking-[0.06em]"
                  style={{ animationDelay: "80ms" }}
                >
                  <span className="orb orb-gold h-7 w-7 rounded-full">
                    <HardHat className="h-4 w-4" strokeWidth={2.2} />
                  </span>
                  Darbas Norvegijoje
                </span>

                <h1
                  className="reveal mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
                  style={{ animationDelay: "160ms" }}
                >
                  Statybų darbai{" "}
                  <span className="bg-gradient-to-r from-[#f2b705] via-[#ffe27a] to-[#5fc2b4] bg-clip-text text-transparent">
                    Norvegijoje
                  </span>
                </h1>

                <p
                  className="reveal mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg"
                  style={{ animationDelay: "240ms" }}
                >
                  Atlyginimas pagal patirtį ir kvalifikaciją.
                </p>

                <div
                  className="reveal glass-dark mt-6 inline-flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ animationDelay: "320ms" }}
                >
                  <span
                    aria-hidden="true"
                    className="pulse-dot h-2.5 w-2.5 rounded-full bg-accent"
                  />

                  <Zap className="h-4 w-4 text-accent" strokeWidth={2.4} />

                  <p className="font-bold text-white">
                    Kandidatūra per 1 minutę
                  </p>
                </div>

                <div
                  className="reveal mt-6 flex flex-col gap-3 sm:flex-row"
                  style={{ animationDelay: "400ms" }}
                >
                  <Link
                    href={pagrindineRegistracija}
                    className="shine group flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-center text-lg font-extrabold text-accent-fg shadow-accent transition hover:-translate-y-0.5 hover:bg-accent-hover"
                  >
                    Kandidatuoti dabar
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" strokeWidth={2.4} />
                  </Link>

                  <Link
                    href="#darbai"
                    className="glass-dark flex items-center justify-center rounded-full px-7 py-3.5 text-center text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
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
          <div className="reveal flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-brand">
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                Darbo pasiūlymai
              </p>

              <h2 className="mt-2 text-3xl font-bold text-fg">
                Pasirinkite tinkamą poziciją
              </h2>
            </div>

            {!loading && darbai.length > 0 && (
              <p className="glass-soft inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-sm font-semibold text-muted sm:self-auto">
                <span
                  aria-hidden="true"
                  className="pulse-dot h-2 w-2 rounded-full bg-ok"
                />
                Aktyvūs pasiūlymai: {darbai.length}
              </p>
            )}
          </div>

          {loading && (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="glass h-80 animate-pulse rounded-[24px]"
                >
                  <span className="sr-only">
                    Kraunami darbo pasiūlymai...
                  </span>
                </div>
              ))}
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
              <div className="glass mt-7 rounded-[20px] p-6 text-muted">
                Šiuo metu aktyvių darbo pasiūlymų nėra.
              </div>
            )}

          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {darbai.map((darbas, index) => (
              <article
                key={darbas.id}
                onMouseMove={trackPointer}
                className="reveal lift spotlight group glass flex h-full flex-col overflow-hidden rounded-[24px]"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <div className="relative flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="orb orb-teal orb-spark h-12 w-12">
                      <HardHat
                        className="h-6 w-6"
                        strokeWidth={2.1}
                      />
                    </div>

                    <span className="glass-soft rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-brand">
                      🇳🇴 Norvegija
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold leading-7 text-fg">
                    {darbas.pavadinimas}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <MapPinned
                      className="h-4 w-4 shrink-0 text-brand"
                      strokeWidth={2.2}
                    />

                    <span className="font-semibold">
                      {darbas.miestas}, Norvegija
                    </span>
                  </div>

                  {darbas.atlyginimas && (
                    <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff3c4]/90 to-[#ffe08a]/70 p-4 ring-1 ring-accent/50 dark:from-accent/20 dark:to-accent/5">
                      <div
                        aria-hidden="true"
                        className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/40 blur-2xl"
                      />

                      <div className="relative flex items-center gap-3">
                        <span className="orb orb-gold h-10 w-10 rounded-xl">
                          <Coins
                            className="h-5 w-5"
                            strokeWidth={2.2}
                          />
                        </span>

                        <div>
                          <span className="text-lg font-extrabold text-fg">
                            {darbas.atlyginimas}
                          </span>

                          <p className="text-xs font-semibold text-warn">
                            Pagal patirtį ir kvalifikaciją
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 grid gap-2">
                    <MiniDetail
                      orb="orb-sky"
                      icon={
                        <Clock3
                          className="h-4 w-4"
                          strokeWidth={2.2}
                        />
                      }
                      label="Grafikas"
                      value={darbas.grafikas}
                    />

                    <MiniDetail
                      orb="orb-violet"
                      icon={
                        <CalendarSync
                          className="h-4 w-4"
                          strokeWidth={2.2}
                        />
                      }
                      label="Rotacija"
                      value={darbas.rotacija}
                    />

                    <MiniDetail
                      orb="orb-rose"
                      icon={
                        <BedDouble
                          className="h-4 w-4"
                          strokeWidth={2.2}
                        />
                      }
                      label="Apgyvendinimas"
                      value={darbas.apgyvendinimas}
                    />

                    <MiniDetail
                      orb="orb-lime"
                      icon={
                        <Award
                          className="h-4 w-4"
                          strokeWidth={2.2}
                        />
                      }
                      label="Patirtis"
                      value={darbas.patirtis_reikalavimas}
                    />
                  </div>

                  {darbas.aprasymas && (
                    <div className="mt-4 border-t border-line/70 pt-4">
                      <p className="max-h-24 overflow-hidden text-sm leading-6 text-muted">
                        {darbas.aprasymas}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {darbas.kalba_reikalavimas && (
                      <Tag
                        orb="orb-sky"
                        icon={<Languages className="h-3.5 w-3.5" strokeWidth={2.4} />}
                        label="Kalbos:"
                        value={darbas.kalba_reikalavimas}
                      />
                    )}

                    {darbas.vairuotojo_pazymejimas && (
                      <Tag
                        orb="orb-slate"
                        icon={<CarFront className="h-3.5 w-3.5" strokeWidth={2.4} />}
                        label="Vairuotojo pažymėjimas:"
                        value={darbas.vairuotojo_pazymejimas}
                      />
                    )}

                    {darbas.kelione && (
                      <Tag
                        orb="orb-amber"
                        icon={<PlaneTakeoff className="h-3.5 w-3.5" strokeWidth={2.4} />}
                        label="Kelionė:"
                        value={darbas.kelione}
                      />
                    )}

                    {darbas.darbo_pradzia && (
                      <Tag
                        orb="orb-lime"
                        icon={<Rocket className="h-3.5 w-3.5" strokeWidth={2.4} />}
                        label="Darbo pradžia:"
                        value={darbas.darbo_pradzia}
                      />
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/registracija?darbas=${darbas.id}`}
                      className="shine group/btn flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 font-extrabold text-accent-fg shadow-accent transition hover:bg-accent-hover"
                    >
                      Kandidatuoti
                      <ArrowRight
                        className="h-5 w-5 transition group-hover/btn:translate-x-1"
                        strokeWidth={2.4}
                      />
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
