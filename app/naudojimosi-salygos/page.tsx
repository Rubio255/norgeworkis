import Link from "next/link";
import LegalFooter from "../components/LegalFooter";

export const metadata = {
  title: "Naudojimosi sąlygos | Norgeworkis",
  description:
    "Norgeworkis naudojimosi sąlygos kandidatams ir svetainės lankytojams.",
};

export default function NaudojimosiSalygosPage() {
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
              Naudojimosi sąlygos
            </h1>

            <p className="mt-4 text-sm text-slate-500">
              Paskutinį kartą atnaujinta: 2026 m. rugpjūčio 27 d.
            </p>
          </div>

          <div className="mt-10 space-y-10 leading-7 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                1. Bendrosios nuostatos
              </h2>

              <p className="mt-4">
                „Norgeworkis“ yra internetinė platforma, skirta darbo
                pasiūlymams ir kandidatų registracijai.
              </p>

              <p className="mt-3">
                Platformą administruoja Įmonių veiklos analizė, MB,
                įmonės kodas 307404233.
              </p>

              <p className="mt-3">
                Naudodamiesi svetaine ir pateikdami kandidatūrą patvirtinate,
                kad susipažinote su šiomis naudojimosi sąlygomis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                2. Platformos paskirtis
              </h2>

              <p className="mt-4">
                Platformoje gali būti skelbiami darbo pasiūlymai Norvegijoje
                ir kitose rinkose, o kandidatai gali pateikti savo
                kandidatūrą į pasirinktą poziciją.
              </p>

              <p className="mt-3">
                Kandidatas gali pateikti kontaktinius duomenis, informaciją
                apie profesinę patirtį, kalbų mokėjimą, CV ir kitą su
                kandidatūra susijusią informaciją.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                3. Kandidatams teikiama paslauga
              </h2>

              <p className="mt-4">
                Kandidatams kandidatūros pateikimas per „Norgeworkis“
                platformą yra nemokamas.
              </p>

              <p className="mt-3">
                Kandidatūros pateikimas negarantuoja darbo pasiūlymo,
                darbo pokalbio, atrankos tęstinumo ar darbo sutarties
                sudarymo.
              </p>

              <p className="mt-3">
                Platformos administratorius gali susisiekti su kandidatu
                dėl pateiktos kandidatūros, papildomos informacijos ar
                tinkamos darbo pozicijos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                4. Kandidato pareigos
              </h2>

              <p className="mt-4">
                Kandidatas privalo pateikti teisingą, aktualią ir teisėtai
                naudojamą informaciją.
              </p>

              <p className="mt-3">
                Kandidatas atsako už savo pateiktų duomenų, dokumentų ir CV
                turinį.
              </p>

              <p className="mt-3">
                Draudžiama pateikti kito asmens duomenis, dokumentus ar CV
                neturint teisėto pagrindo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                5. Darbo pasiūlymai
              </h2>

              <p className="mt-4">
                Platformoje pateikiama informacija apie darbo pasiūlymus
                gali būti gaunama iš darbdavių, partnerių ar kitų teisėtų
                šaltinių.
              </p>

              <p className="mt-3">
                Platformos administratorius siekia pateikti aktualią
                informaciją, tačiau darbo sąlygos gali keistis.
              </p>

              <p className="mt-3">
                Galutinės darbo sąlygos, darbo užmokestis, darbo vieta,
                darbo grafikas, apgyvendinimas, kelionės sąlygos ir kitos
                darbo sutarties sąlygos nustatomos tarp kandidato ir
                konkretaus darbdavio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                6. Kandidatūros perdavimas darbdaviams
              </h2>

              <p className="mt-4">
                Kandidato pateikta informacija ir CV gali būti perduodami
                potencialiems darbdaviams, kai tai reikalinga kandidatūrai
                dėl pasirinktos ar kandidato kvalifikaciją atitinkančios
                darbo pozicijos pateikti.
              </p>

              <p className="mt-3">
                Kandidatų duomenys nėra viešai skelbiami interneto
                svetainėje.
              </p>

              <p className="mt-3">
                Išsamesnė informacija apie asmens duomenų tvarkymą
                pateikiama Privatumo politikoje.
              </p>

              <Link
                href="/privatumo-politika"
                className="mt-4 inline-block font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600"
              >
                Privatumo politika
              </Link>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                7. Platformos vaidmuo
              </h2>

              <p className="mt-4">
                „Norgeworkis“ suteikia techninę ir administracinę galimybę
                skelbti darbo pasiūlymus, priimti kandidatūras ir perduoti
                kandidatų informaciją potencialiems darbdaviams.
              </p>

              <p className="mt-3">
                Platformos administratorius nėra kandidato būsimas
                darbdavys, išskyrus atvejus, kai konkrečiame darbo
                pasiūlyme aiškiai nurodyta kitaip.
              </p>

              <p className="mt-3">
                Darbo sutartis, jei ji sudaroma, sudaroma tarp kandidato ir
                konkretaus darbdavio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                8. Atsiskaitymai
              </h2>

              <p className="mt-4">
                Kandidatams kandidatūros pateikimas per platformą yra
                nemokamas.
              </p>

              <p className="mt-3">
                Platformos administratorius gali sudaryti komercinius
                susitarimus su darbdaviais ar partneriais dėl kandidatų
                paieškos, atrankos, konsultavimo, darbo pasiūlymų skelbimo
                ar kitų paslaugų.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                9. Svetainės naudojimas
              </h2>

              <p className="mt-4">
                Naudotojai negali naudoti svetainės neteisėtais tikslais,
                bandyti pažeisti jos saugumą, trikdyti jos veikimą ar
                neteisėtai gauti prieigą prie kitų naudotojų ar kandidatų
                duomenų.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                10. Intelektinė nuosavybė
              </h2>

              <p className="mt-4">
                „Norgeworkis“ pavadinimas, svetainės dizainas, struktūra,
                tekstai ir kitas platformos turinys negali būti
                neteisėtai kopijuojamas, platinamas ar naudojamas
                komerciniais tikslais.
              </p>

              <p className="mt-3">
                Trečiųjų asmenų pateikta informacija, logotipai ar kita
                intelektinė nuosavybė priklauso atitinkamiems jų teisių
                turėtojams.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                11. Atsakomybės ribojimas
              </h2>

              <p className="mt-4">
                Platformos administratorius negali garantuoti, kad
                kandidatas gaus darbo pasiūlymą arba kad konkretus darbo
                pasiūlymas išliks prieinamas.
              </p>

              <p className="mt-3">
                Platformos administratorius neatsako už darbdavio ir
                kandidato sudarytos darbo sutarties vykdymą, darbdavio
                veiksmus ar darbo santykių eigą, išskyrus atvejus, kai
                tokia atsakomybė kyla pagal taikomus teisės aktus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                12. Paslaugos veikimo pakeitimai
              </h2>

              <p className="mt-4">
                Platformos administratorius gali keisti svetainės
                funkcionalumą, darbo pasiūlymų pateikimo tvarką ir kitas
                platformos funkcijas.
              </p>

              <p className="mt-3">
                Atskiros funkcijos gali būti laikinai nepasiekiamos dėl
                techninės priežiūros, atnaujinimų ar kitų techninių
                priežasčių.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                13. Naudojimosi sąlygų pakeitimai
              </h2>

              <p className="mt-4">
                Šios naudojimosi sąlygos gali būti keičiamos pasikeitus
                platformos funkcionalumui, veiklos modeliui arba taikomiems
                teisės aktams.
              </p>

              <p className="mt-3">
                Naujausia naudojimosi sąlygų versija visada skelbiama šiame
                puslapyje.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Platformos administratorius
              </h2>

              <p className="mt-3">
                <strong>Įmonių veiklos analizė, MB</strong>
              </p>

              <p>Įmonės kodas: 307404233</p>

              <p>
                Adresas: Giedraičių g. 39, R53, LT-09302 Vilnius,
                Lietuva
              </p>

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