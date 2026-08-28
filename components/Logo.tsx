import Link from "next/link";

export default function Logo({ href = "/", compact = false, inverted = false }: { href?: string; compact?: boolean; inverted?: boolean }) {
  return (
    <Link href={href} className={`group inline-flex items-center ${inverted ? "text-white" : "text-primary"}`} aria-label="emptyhanded home">
      <span className="display-type whitespace-nowrap text-lg font-black lowercase leading-none tracking-[-0.055em] transition-opacity group-hover:opacity-70 sm:text-xl">
        {compact ? "eh" : "emptyhanded"}<span className="relative -top-px ml-px inline-block text-[1.55em] font-black leading-0 text-accent">.</span>
      </span>
    </Link>
  );
}
