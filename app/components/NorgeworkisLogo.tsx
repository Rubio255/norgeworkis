import Link from "next/link";

export default function NorgeworkisLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center"
      aria-label="Norgeworkis – pradinis puslapis"
    >
      <img
        src="/norgeworkis-logo.svg"
        alt="Norgeworkis"
        className="h-10 w-auto object-contain sm:h-12"
      />
    </Link>
  );
}