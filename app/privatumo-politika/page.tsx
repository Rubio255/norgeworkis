import Link from "next/link";
import LegalFooter from "../components/LegalFooter";

export const metadata = {
  title: "Privatumo politika | Norgeworkis",
  description:
    "Norgeworkis privatumo politika ir informacija apie kandidatų asmens duomenų tvarkymą.",
};

export default function PrivatumoPolitikaPage() {
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
              Privatumo politika
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Paskutinį kartą atnaujinta: 2026 m. rugpjūčio 27 d.
            </p>
          </div>

          <div className="mt-10 space-y-10 leading-7 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                1. Duomenų valdytojas
              </h2>

              <p className="mt-4">
                „Norgeworkis“ platformos asmens duomenų valdytojas yra
                Įmonių veiklos analizė, MB.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-5">
                <p>
                  <strong>Įmonių veiklos analizė, MB</strong>
                </p>

                <p>Įmonės kodas: 307404233</p>

                <p>El. paštas: info@optinvest.lt</p>
              </div>

              <p className="mt-4">
                „Norgeworkis“ yra šio juridinio asmens administruojama
                internetinė platforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                2. Kokius asmens duomenis renkame
              </h2>

              <p className="mt-4">
                Kandidatui pateikiant kandidatūrą per „Norgeworkis“
                platformą, gali būti renkami šie asmens duomenys:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>vardas ir pavardė;</li>
                <li>telefono numeris;</li>
                <li>el. pašto adresas;</li>
                <li>profesija ir darbo sritis;</li>
                <li>darbo patirtis;</li>
                <li>kalbų mokėjimo lygis;</li>
                <li>gyvenimo aprašymas (CV);</li>
                <li>
                  kita informacija, kurią kandidatas savanoriškai pateikia
                  anketoje arba CV;
                </li>
                <li>
                  informacija apie pasirinktą darbo pasiūlymą ar darbo
                  poziciją.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                3. Duomenų tvarkymo tikslai
              </h2>

              <p className="mt-4">
                Kandidatų asmens duomenys gali būti tvarkomi šiais
                tikslais:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>kandidatūros priėmimui ir administravimui;</li>
                <li>
                  kandidato profesinės patirties ir tinkamumo darbo
                  pozicijoms įvertinimui;
                </li>
                <li>susisiekimui su kandidatu;</li>
                <li>
                  kandidatūros pateikimui potencialiems darbdaviams;
                </li>
                <li>
                  kandidatų ir darbo pasiūlymų administravimui;
                </li>
                <li>
                  teisinių prievolių vykdymui ir galimų ginčų
                  administravimui;
                </li>
                <li>
                  platformos saugumui ir neteisėto naudojimo prevencijai.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                4. Duomenų tvarkymo teisinis pagrindas
              </h2>

              <p className="mt-4">
                Asmens duomenys tvarkomi vadovaujantis Bendruoju duomenų
                apsaugos reglamentu (BDAR) ir kitais taikomais teisės
                aktais.
              </p>

              <p className="mt-3">
                Priklausomai nuo konkretaus duomenų tvarkymo veiksmo,
                duomenys gali būti tvarkomi kandidato prašymu prieš
                sudarant sutartį, kandidato sutikimo pagrindu, vykdant
                teisines prievoles arba siekiant teisėtų duomenų valdytojo
                interesų.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                5. Duomenų perdavimas potencialiems darbdaviams
              </h2>

              <p className="mt-4">
                Kandidato pateikta informacija ir CV gali būti perduodami
                potencialiems darbdaviams, kai tai reikalinga kandidatūrai
                dėl pasirinktos arba kandidato kvalifikaciją atitinkančios
                darbo pozicijos pateikti.
              </p>

              <p className="mt-3">
                Kandidatūros gali būti perduodamos Lietuvoje, Norvegijoje
                ar kitose Europos ekonominės erdvės valstybėse
                veikiančioms įmonėms, kai tai susiję su kandidato darbo
                paieška.
              </p>

              <p className="mt-3">
                Kandidatų asmens duomenys nėra viešai skelbiami
                „Norgeworkis“ svetainėje.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                6. Paslaugų teikėjai
              </h2>

              <p className="mt-4">
                Platformos veikimui gali būti pasitelkiami techninių
                paslaugų teikėjai, kurie duomenis tvarko tik tiek, kiek tai
                būtina jų paslaugoms teikti.
              </p>

              <p className="mt-3">
                Tokios paslaugos gali apimti duomenų bazės,
                autentifikavimo, failų saugojimo, svetainės talpinimo,
                el. pašto ir kitų informacinių sistemų infrastruktūros
                paslaugas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                7. Kandidatų duomenų ir CV saugumas
              </h2>

              <p className="mt-4">
                Kandidatų CV ir kita kandidatūros informacija nėra viešai
                prieinama svetainės lankytojams.
              </p>

              <p className="mt-3">
                Prieiga prie kandidatų duomenų ribojama pagal naudotojų
                teises, o CV saugomi neviešoje failų saugykloje.
              </p>

              <p className="mt-3">
                Taikomos techninės ir organizacinės priemonės, skirtos
                apsaugoti duomenis nuo neteisėtos prieigos, pakeitimo,
                atskleidimo ar sunaikinimo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                8. Duomenų saugojimo laikotarpis
              </h2>

              <p className="mt-4">
                Kandidatų asmens duomenys saugomi tik tiek laiko, kiek jų
                reikia kandidatūros administravimo, potencialių darbo
                pasiūlymų pateikimo ar teisinių prievolių vykdymo tikslais.
              </p>

              <p className="mt-3">
                Kai asmens duomenys nebėra reikalingi tikslams, dėl kurių
                jie buvo surinkti, ir nėra kito teisėto pagrindo juos
                saugoti, jie ištrinami arba anonimizuojami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                9. Kandidato teisės
              </h2>

              <p className="mt-4">
                Duomenų subjektas, kai taikoma, turi teisę:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>gauti informaciją apie savo duomenų tvarkymą;</li>
                <li>susipažinti su savo asmens duomenimis;</li>
                <li>reikalauti ištaisyti netikslius duomenis;</li>
                <li>reikalauti ištrinti duomenis;</li>
                <li>reikalauti apriboti duomenų tvarkymą;</li>
                <li>nesutikti su duomenų tvarkymu, kai tai taikoma;</li>
                <li>
                  atšaukti sutikimą, kai duomenų tvarkymas grindžiamas
                  sutikimu;
                </li>
                <li>
                  pasinaudoti duomenų perkeliamumo teise, kai ji taikoma.
                </li>
              </ul>

              <p className="mt-4">
                Norėdami pasinaudoti savo teisėmis, galite kreiptis el.
                paštu:
              </p>

              <p className="mt-2 font-semibold">info@optinvest.lt</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                10. Sutikimo atšaukimas
              </h2>

              <p className="mt-4">
                Kai asmens duomenų tvarkymas grindžiamas kandidato
                sutikimu, kandidatas turi teisę savo sutikimą bet kada
                atšaukti.
              </p>

              <p className="mt-3">
                Sutikimo atšaukimas neturi įtakos duomenų tvarkymo,
                atlikto iki sutikimo atšaukimo, teisėtumui.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                11. Skundų pateikimas
              </h2>

              <p className="mt-4">
                Jei manote, kad jūsų asmens duomenys tvarkomi netinkamai,
                galite pirmiausia kreiptis į duomenų valdytoją el. paštu
                info@optinvest.lt.
              </p>

              <p className="mt-3">
                Taip pat turite teisę pateikti skundą kompetentingai
                asmens duomenų apsaugos priežiūros institucijai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                12. Privatumo politikos pakeitimai
              </h2>

              <p className="mt-4">
                Ši privatumo politika gali būti keičiama pasikeitus
                platformos funkcionalumui, duomenų tvarkymo procesams,
                naudojamoms technologijoms arba taikomiems teisės aktams.
              </p>

              <p className="mt-3">
                Naujausia privatumo politikos versija visada skelbiama
                šiame puslapyje.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Kontaktai dėl asmens duomenų
              </h2>

              <p className="mt-3">
                <strong>Įmonių veiklos analizė, MB</strong>
              </p>

              <p>Įmonės kodas: 307404233</p>

              <p>El. paštas: info@optinvest.lt</p>
            </section>
          </div>
        </article>
      </main>

      <LegalFooter />
    </>
  );
}