import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { FAQ_RESOURCE, TESTIMONIAL_RESOURCE } from "@/lib/admin.fields";

export const Route = createFileRoute("/admin/content")({
  ssr: false,
  component: SitecontentAdmin,
});

function SitecontentAdmin() {
  const [tab, setTab] = useState(0);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
          <button type="button" onClick={() => setTab(0)} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${tab === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{FAQ_RESOURCE.title}</button>
          <button type="button" onClick={() => setTab(1)} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${tab === 1 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{TESTIMONIAL_RESOURCE.title}</button>
      </div>
      <div>
        {tab === 0 ? <ResourceManager resource={FAQ_RESOURCE} /> : null}
        {tab === 1 ? <ResourceManager resource={TESTIMONIAL_RESOURCE} /> : null}
      </div>
    </div>
  );
}
