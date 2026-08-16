import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { CATEGORY_RESOURCE } from "@/lib/admin.fields";

export const Route = createFileRoute("/admin/categories")({
  ssr: false,
  component: () => <ResourceManager resource={CATEGORY_RESOURCE} />,
});
