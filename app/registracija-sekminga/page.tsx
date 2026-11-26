import Link from "next/link";

export default function RegistracijaSekmingaPage() {
  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
        <div className="w-full rounded-[20px] bg-surface p-8 text-center shadow-card md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok-bg text-3xl text-ok">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-fg">
            Kandidatūra pateikta
          </h1>

          <p className="mt-4 text-lg leading-8 text-muted">
            Jūsų kandidatūra sėkmingai pateikta.
            Jei jūsų patirtis ir kvalifikacija atitiks darbo pasiūlymą,
            su jumis gali būti susisiekta nurodytais kontaktais.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-accent px-6 py-3 font-extrabold text-accent-fg shadow-accent transition hover:bg-accent-hover"
            >
              Grįžti į darbo pasiūlymus
            </Link>

            <Link
              href="/registracija"
              className="rounded-full border border-line bg-surface px-6 py-3 font-bold text-fg transition hover:bg-surface-2"
            >
              Pateikti kitą kandidatūrą
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}