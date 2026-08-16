import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { EXPORT_COUNTRY_RESOURCE } from "@/lib/admin.fields";

export const Route = createFileRoute("/admin/markets")({
  ssr: false,
  component: () => <ResourceManager resource={EXPORT_COUNTRY_RESOURCE} />,
});
