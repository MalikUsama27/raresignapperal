import { Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

/** Social profile links driven by editable site settings (instagram_url / facebook_url). */
export function SocialLinks({
  settings,
  className,
}: {
  settings: Record<string, string>;
  className?: string;
}) {
  const links = [
    { label: "Instagram", href: settings?.["instagram_url"], Icon: Instagram },
    { label: "Facebook", href: settings?.["facebook_url"], Icon: Facebook },
  ].filter((link) => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href as string}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Rare Signs Apparel on ${label}`}
          className="inline-flex size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
