import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { PRODUCT_RESOURCE } from "@/lib/admin.fields";

export const Route = createFileRoute("/admin/products")({
  ssr: false,
  component: () => <ResourceManager resource={PRODUCT_RESOURCE} />,
});
