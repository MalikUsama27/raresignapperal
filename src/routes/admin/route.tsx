import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Boxes,
  FileText,
  Globe2,
  Inbox,
  LayoutDashboard,
  ListTree,
  LogOut,
  MessageSquareQuote,
  Package,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/categories", label: "Categories", icon: Boxes },
  { to: "/admin/subcategories", label: "Subcategories", icon: ListTree },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/content", label: "Site content", icon: MessageSquareQuote },
  { to: "/admin/markets", label: "Export markets", icon: Globe2 },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (location.pathname.startsWith("/admin/login")) return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (location.pathname.startsWith("/admin/login")) return <Outlet />;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-border bg-surface lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-display text-sm font-bold tracking-tight">Rare Signs Apparel</p>
              <p className="text-xs text-muted-foreground">Admin panel</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => void signOut()} aria-label="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to as never}
                activeOptions={{ exact: item.exact ?? false }}
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
              >
                <item.icon className="size-4" /> {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-5 py-7 lg:px-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
