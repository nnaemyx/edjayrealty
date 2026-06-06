import Image from "next/image";
import Link from "next/link";

export default function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "text-white" : "text-dark";

  return (
    <Link href="/" className="flex items-center gap-2.5 group" id="logo">
      <div className="relative w-11 h-11 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
        <Image
          src="/logo.png"
          alt="Edjay Realty"
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`text-xl font-bold tracking-tight font-[family-name:var(--font-heading)] ${textColor} group-hover:opacity-90 transition-opacity`}
        >
          Edjay<span className="text-primary"> Realty</span>
        </span>
        <span
          className={`text-[9px] uppercase tracking-[0.2em] ${
            variant === "light" ? "text-white/60" : "text-text-muted"
          } font-medium`}
        >
          For The Future
        </span>
      </div>
    </Link>
  );
}
