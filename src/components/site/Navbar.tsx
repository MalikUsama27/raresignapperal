import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { SearchDialog } from "./SearchDialog";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/utils";
import type { NavCategory } from "@/lib/catalog.functions";

const PAGES = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Manufacturing", to: "/manufacturing" },
  { label: "Customization", to: "/customization" },
  { label: "Export Markets", to: "/export-markets" },
  { label: "Insights", to: "/blog" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar({ categories }: { categories: NavCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <nav className="container-page flex h-16 items-center justify-between gap-6 md:h-20" aria-label="Main">
          <BrandLogo />

          <div className="hidden items-center gap-1 lg:flex">
            {PAGES.slice(0, 2).map((page) => (
              <NavItem key={page.to} to={page.to} label={page.label} active={pathname === page.to} />
            ))}

            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                onClick={() => navigate({ to: "/products" })}
                aria-expanded={megaOpen}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname.startsWith("/products") || pathname.startsWith("/category") ? "text-foreground" : "",
                )}
              >
                Products <ChevronDown className={cn("size-3.5 transition-transform", megaOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {megaOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="absolute left-1/2 top-full w-[min(72rem,calc(100vw-3rem))] -translate-x-1/2 pt-3"
                  >
                    <div className="glass-panel grid gap-x-8 gap-y-6 rounded-2xl p-6 shadow-[var(--shadow-elevate)] md:grid-cols-3 lg:grid-cols-4">
                      {categories.map((category) => (
                        <div key={category.id}>
                          <Link
                            to="/category/$slug"
                            params={{ slug: category.slug }}
                            className="font-display text-sm font-semibold tracking-tight transition-colors hover:text-primary"
                          >
                            {category.name}
                          </Link>
                          <ul className="mt-2.5 space-y-1.5">
                            {category.subcategories.slice(0, 5).map((sub) => (
                              <li key={sub.id}>
                                <Link
                                  to="/category/$category/$subcategory"
                                  params={{ category: category.slug, subcategory: sub.slug }}
                                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                            {category.subcategories.length > 5 ? (
                              <li>
                                <Link
                                  to="/category/$slug"
                                  params={{ slug: category.slug }}
                                  className="text-[13px] font-medium text-primary"
                                >
                                  +{category.subcategories.length - 5} more
                                </Link>
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {PAGES.slice(2).map((page) => (
              <NavItem key={page.to} to={page.to} label={page.label} active={pathname === page.to} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Search className="size-4" />
            </button>
            <Link
              to="/contact"
              className="hidden rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02] sm:inline-flex"
            >
              Get a quote
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="grid size-10 place-items-center rounded-md border border-border lg:hidden"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
            >
              <div className="container-page max-h-[70vh] space-y-1 overflow-y-auto py-5">
                {PAGES.map((page) => (
                  <Link
                    key={page.to}
                    to={page.to}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-elevated hover:text-foreground"
                  >
                    {page.label}
                  </Link>
                ))}
                <Link
                  to="/products"
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-elevated hover:text-foreground"
                >
                  All products
                </Link>
                <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Categories
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to="/category/$slug"
                    params={{ slug: category.slug }}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-elevated hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function NavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}
