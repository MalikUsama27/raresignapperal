import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureAdminAccount } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administrator sign in | Rare Signs Apparel" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

function AdminLogin() {
  const navigate = useNavigate();
  const bootstrap = useServerFn(ensureAdminAccount);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  useEffect(() => {
    // Idempotent: provisions the single configured administrator on first run.
    void bootstrap({ data: undefined }).catch(() => undefined);
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [bootstrap, navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (Date.now() < lockedUntil) {
      setError("Too many failed attempts. Please wait a minute and try again.");
      return;
    }
    setPending(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setPending(false);

    if (signInError) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setAttempts(0);
        setError("Too many failed attempts. Access temporarily locked.");
      } else {
        setError("Invalid email or password.");
      }
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-5" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Restricted area</p>
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Administrator sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access is limited to the authorised Rare Signs Apparel administrator. There is no public registration.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : null} Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
