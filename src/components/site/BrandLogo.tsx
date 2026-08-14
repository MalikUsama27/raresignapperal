import { Link } from "@tanstack/react-router";
import logoFull from "@/assets/rare-signs-logo.png.asset.json";
import logoMark from "@/assets/rare-signs-mark.png.asset.json";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  /** Show the wordmark image instead of the compact mark + text lockup. */
  variant?: "lockup" | "full";
};

/**
 * Rare Signs Apparel brand lockup. Logo proportions are preserved via
 * width:auto + object-contain — never set both width and height.
 */
export function BrandLogo({ className, markClassName, variant = "lockup" }: BrandLogoProps) {
  if (variant === "full") {
    return (
      <Link to="/" className={cn("inline-flex items-center", className)} aria-label="Rare Signs Apparel — home">
        <img
          src={logoFull.url}
          alt="Rare Signs Apparel logo"
          className={cn("h-16 w-auto object-contain", markClassName)}
          loading="lazy"
        />
      </Link>
    );
  }

  return (
    <Link to="/" className={cn("flex items-center gap-3", className)} aria-label="Rare Signs Apparel — home">
      <img
        src={logoMark.url}
        alt="Rare Signs Apparel logo"
        className={cn("h-9 w-auto shrink-0 object-contain md:h-10", markClassName)}
      />
      <span className="font-display text-sm font-bold leading-tight tracking-tight sm:text-base md:text-[1.0625rem]">
        RARE SIGNS<span className="text-primary"> APPAREL</span>
      </span>
    </Link>
  );
}
