import Link from "next/link";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "text-white" : "text-dark";
  const accentColor = "text-primary";

  return (
    <Link href="/" className="flex items-center gap-2 group" id="logo">
      {/* Icon Mark */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
          {/* House shape */}
          <path
            d="M20 4L4 18H8V34H16V24H24V34H32V18H36L20 4Z"
            className="fill-primary"
          />
          {/* Door accent */}
          <rect x="17" y="24" width="6" height="10" className="fill-accent" rx="1" />
          {/* Window */}
          <rect x="12" y="19" width="5" height="4" rx="0.5" className="fill-white" opacity="0.9" />
          <rect x="23" y="19" width="5" height="4" rx="0.5" className="fill-white" opacity="0.9" />
        </svg>
      </div>
      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className={`text-xl font-bold tracking-tight font-[family-name:var(--font-heading)] ${textColor} group-hover:opacity-90 transition-opacity`}>
          Edjay<span className={accentColor}> Realty</span>
        </span>
        <span className={`text-[9px] uppercase tracking-[0.2em] ${variant === "light" ? "text-white/60" : "text-text-muted"} font-medium`}>
          For The Future
        </span>
      </div>
    </Link>
  );
}
