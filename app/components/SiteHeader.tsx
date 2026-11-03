import Link from "next/link";
import NorgeworkisLogo from "./NorgeworkisLogo";

type SiteHeaderProps = {
  showJobsLink?: boolean;
};

export default function SiteHeader({
  showJobsLink = true,
}: SiteHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NorgeworkisLogo />

        {showJobsLink && (
          <Link
            href="/"
            className="text-sm font-bold text-slate-600 transition hover:text-blue-700"
          >
            Darbo pasiūlymai
          </Link>
        )}
      </div>
    </header>
  );
}