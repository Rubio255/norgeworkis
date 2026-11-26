import Link from "next/link";
import NorgeworkisLogo from "./NorgeworkisLogo";

type SiteHeaderProps = {
  showJobsLink?: boolean;
};

export default function SiteHeader({
  showJobsLink = true,
}: SiteHeaderProps) {
  return (
    <header className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NorgeworkisLogo />

        {showJobsLink && (
          <Link
            href="/"
            className="text-sm font-bold text-muted transition hover:text-brand"
          >
            Darbo pasiūlymai
          </Link>
        )}
      </div>
    </header>
  );
}