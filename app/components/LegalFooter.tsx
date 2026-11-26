import Link from "next/link";

export default function LegalFooter() {
  return (
    <footer className="glass border-x-0 border-b-0 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
          <Link
            href="/privatumo-politika"
            className="font-semibold text-muted hover:text-fg"
          >
            Privatumo politika
          </Link>

          <Link
            href="/naudojimosi-salygos"
            className="font-semibold text-muted hover:text-fg"
          >
            Naudojimosi sąlygos
          </Link>

          <Link
            href="/saugumas"
            className="font-semibold text-muted hover:text-fg"
          >
            Duomenų saugumas
          </Link>
        </div>

        <div className="mt-6 border-t border-line pt-6 text-sm text-muted">
          <p>
            Norgeworkis – darbo pasiūlymų ir kandidatų pateikimo platforma.
          </p>

          <p className="mt-2">
            Kandidatams paslauga teikiama nemokamai.
          </p>

          <p className="mt-2">
            © {new Date().getFullYear()} Norgeworkis. Visos teisės saugomos.
          </p>
        </div>
      </div>
    </footer>
  );
}