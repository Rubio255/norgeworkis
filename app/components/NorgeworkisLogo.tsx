import Link from "next/link";

// Ženklas Ridu stiliumi: žalias apvalus kvadratas, balta „N“ kaip kelias ir geltonas taškas tikslui
export function NorgeworkisMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="64" height="64" rx="14" fill="#0f4c45" />
      <path
        d="M20 47 V19 L44 45 V29"
        fill="none"
        stroke="#ffffff"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="17" r="6" fill="#f2b705" />
    </svg>
  );
}

export default function NorgeworkisLogo({
  light = false,
}: {
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5"
      aria-label="Norgeworkis – pradinis puslapis"
    >
      <NorgeworkisMark size={38} />

      <span
        className={`font-display text-2xl font-bold tracking-tight ${
          light ? "text-white" : "text-navy dark:text-fg"
        }`}
      >
        Norgeworkis
      </span>
    </Link>
  );
}
