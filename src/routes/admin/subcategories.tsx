import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SUBCATEGORY_RESOURCE } from "@/lib/admin.fields";

export const Route = createFileRoute("/admin/subcategories")({
  ssr: false,
  component: () => <ResourceManager resource={SUBCATEGORY_RESOURCE} />,
});
