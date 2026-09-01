import Link from "next/link";

export default function RegistracijaSekmingaPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-950">
            Kandidatūra pateikta
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Jūsų kandidatūra sėkmingai pateikta.
            Jei jūsų patirtis ir kvalifikacija atitiks darbo pasiūlymą,
            su jumis gali būti susisiekta nurodytais kontaktais.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Grįžti į darbo pasiūlymus
            </Link>

            <Link
              href="/registracija"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Pateikti kitą kandidatūrą
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}