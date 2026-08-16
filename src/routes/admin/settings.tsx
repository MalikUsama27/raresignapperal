import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminGetSettings, adminSaveSettings } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const get = useServerFn(adminGetSettings);
  const save = useServerFn(adminSaveSettings);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: () => get({ data: undefined }),
  });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) setValues(Object.fromEntries(data.map((row) => [row.key, row.value ?? ""])));
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      save({ data: { entries: Object.entries(values).map(([key, value]) => ({ key, value })) } }),
    onSuccess: () => toast.success("Settings saved"),
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Site settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Company details, contact channels and homepage statistics used across the website.
        </p>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-2">
        {Object.keys(values)
          .sort()
          .map((key) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {key.replace(/_/g, " ")}
              </Label>
              <Input
                value={values[key] ?? ""}
                onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
              />
            </div>
          ))}
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save settings
      </Button>
    </div>
  );
}
