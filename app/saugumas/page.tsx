import Link from "next/link";
import LegalFooter from "../components/LegalFooter";

export const metadata = {
  title: "Duomenų saugumas | Norgeworkis",
};

export default function SaugumasPage() {
  return (
    <>
      <main className="min-h-screen bg-slate-100 px-6 py-12">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <Link
            href="/"
            className="inline-block text-2xl font-black tracking-[0.08em] text-slate-900 transition hover:text-slate-600"
          >
            NORGEWORKIS
          </Link>

          <div className="mt-8 border-b border-slate-200 pb-8">
            <h1 className="text-4xl font-bold text-slate-900">
              Duomenų saugumas
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Informacija apie tai, kaip „Norgeworkis“ saugo kandidatų
              informaciją ir CV.
            </p>
          </div>

          <div className="mt-10 space-y-10 leading-7 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Kandidatų duomenys nėra vieši
              </h2>

              <p className="mt-4">
                Kandidato anketoje pateikta informacija nėra viešai
                rodoma svetainės lankytojams.
              </p>

              <p className="mt-3">
                Kandidatų informaciją gali pasiekti tik tam teisę turintys
                platformos naudotojai ir, kai tai reikalinga kandidatūros
                pateikimui, potencialūs darbdaviai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                CV saugojimas
              </h2>

              <p className="mt-4">
                Kandidatų pateikti CV saugomi neviešoje failų saugykloje.
              </p>

              <p className="mt-3">
                CV nėra talpinami viešai prieinamame failų kataloge.
                Prieiga prie jų suteikiama tik autorizuotiems naudotojams
                arba naudojant ribotos prieigos mechanizmus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Administratoriaus prieiga
              </h2>

              <p className="mt-4">
                Platformos administravimo dalis apsaugota naudotojo
                autentifikacija.
              </p>

              <p className="mt-3">
                Administravimo funkcijos ir kandidatų informacija nėra
                prieinamos paprastiems svetainės lankytojams.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Prieigos kontrolė
              </h2>

              <p className="mt-4">
                Duomenų bazėje naudojamos prieigos kontrolės taisyklės,
                kurios riboja, kokias operacijas gali atlikti vieši
                svetainės lankytojai ir autentifikuoti administratoriai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Duomenų minimizavimas
              </h2>

              <p className="mt-4">
                Siekiama rinkti tik tokią kandidatų informaciją, kuri
                reikalinga kandidatūros administravimui ir potencialiam
                darbo pasiūlymui įvertinti.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Kandidatūros perdavimas
              </h2>

              <p className="mt-4">
                Kandidato duomenys ir CV potencialiam darbdaviui
                perduodami tik kandidatūros administravimo ir darbo
                pasiūlymo tikslu.
              </p>

              <p className="mt-3">
                Kandidatų duomenys nėra skelbiami viešuose kandidatų
                sąrašuose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Techninės saugumo priemonės
              </h2>

              <p className="mt-4">
                Platformoje gali būti naudojamos autentifikavimo,
                duomenų bazės prieigos kontrolės, privačios failų
                saugyklos, šifruoto ryšio ir kitos techninės saugumo
                priemonės.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                Pranešimas apie saugumo problemą
              </h2>

              <p className="mt-4">
                Jei pastebėjote galimą platformos saugumo problemą arba
                manote, kad jūsų duomenys galėjo būti pasiekti netinkamai,
                susisiekite su mumis:
              </p>

              <p className="mt-3 font-semibold">
                info@optinvest.lt
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Duomenų valdytojas
              </h2>

              <p className="mt-3">
                <strong>Įmonių veiklos analizė, MB</strong>
              </p>
              <p>Įmonės kodas: 307404233</p>
              <p>El. paštas: info@optinvest.lt</p>
              <p>Telefonas: +370 649 94125</p>
            </section>
          </div>
        </article>
      </main>

      <LegalFooter />
    </>
  );
}