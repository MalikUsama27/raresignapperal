import type { AdminTable } from "./admin.functions";

export type FieldType =
  | "text"
  | "slug"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "image"
  | "csv"
  | "json"
  | "date"
  | "ref";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  /** For type "ref": which reference list to pick from. */
  refKey?: "categories" | "subcategories" | "blog_categories";
  optional?: boolean;
  full?: boolean;
};

export type ResourceDef = {
  table: AdminTable;
  title: string;
  description: string;
  /** Columns rendered in the list view. */
  columns: { name: string; label: string }[];
  fields: FieldDef[];
  defaults?: Record<string, unknown>;
  sortable?: boolean;
};

const seoFields: FieldDef[] = [
  { name: "seo_title", label: "SEO title", type: "text", optional: true, full: true },
  { name: "seo_description", label: "SEO description", type: "textarea", optional: true, full: true },
];

export const CATEGORY_RESOURCE: ResourceDef = {
  table: "categories",
  title: "Categories",
  description: "Top-level ranges shown in the navigation mega menu, category pages and product filters.",
  sortable: true,
  columns: [
    { name: "name", label: "Name" },
    { name: "slug", label: "Slug" },
    { name: "sort_order", label: "Order" },
    { name: "is_active", label: "Active" },
  ],
  defaults: { is_active: true, sort_order: 0 },
  fields: [
    { name: "name", label: "Category name", type: "text" },
    { name: "slug", label: "Slug", type: "slug", help: "Used in the URL: /category/your-slug" },
    { name: "tagline", label: "Tagline", type: "text", optional: true },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "description", label: "Description", type: "textarea", optional: true, full: true },
    { name: "image_url", label: "Image", type: "image", optional: true, full: true },
    { name: "is_active", label: "Visible on website", type: "boolean" },
    ...seoFields,
  ],
};

export const SUBCATEGORY_RESOURCE: ResourceDef = {
  table: "subcategories",
  title: "Subcategories",
  description: "Sub-ranges nested under a category, e.g. Sportswear → Basketball Uniforms.",
  sortable: true,
  columns: [
    { name: "name", label: "Name" },
    { name: "category_id", label: "Category" },
    { name: "slug", label: "Slug" },
    { name: "sort_order", label: "Order" },
    { name: "is_active", label: "Active" },
  ],
  defaults: { is_active: true, sort_order: 0 },
  fields: [
    { name: "name", label: "Subcategory name", type: "text" },
    { name: "slug", label: "Slug", type: "slug" },
    { name: "category_id", label: "Parent category", type: "ref", refKey: "categories" },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "description", label: "Description", type: "textarea", optional: true, full: true },
    { name: "image_url", label: "Image", type: "image", optional: true, full: true },
    { name: "is_active", label: "Visible on website", type: "boolean" },
    ...seoFields,
  ],
};

export const PRODUCT_RESOURCE: ResourceDef = {
  table: "products",
  title: "Products",
  description: "Catalogue items. Published products appear on the products page, category pages, search and sitemap.",
  sortable: true,
  columns: [
    { name: "name", label: "Product" },
    { name: "sku", label: "Code" },
    { name: "category_id", label: "Category" },
    { name: "is_featured", label: "Featured" },
    { name: "is_published", label: "Published" },
  ],
  defaults: { is_published: true, is_featured: false, sort_order: 0, sizes: [], colors: [], gallery: [] },
  fields: [
    { name: "name", label: "Product name", type: "text" },
    { name: "slug", label: "Slug", type: "slug" },
    { name: "sku", label: "Product code", type: "text", optional: true },
    { name: "material", label: "Material", type: "text", optional: true },
    { name: "category_id", label: "Category", type: "ref", refKey: "categories" },
    { name: "subcategory_id", label: "Subcategory", type: "ref", refKey: "subcategories", optional: true },
    { name: "short_description", label: "Short description", type: "textarea", optional: true, full: true },
    { name: "description", label: "Full description", type: "markdown", optional: true, full: true },
    { name: "sizes", label: "Available sizes", type: "csv", help: "Comma separated, e.g. XS, S, M, L, XL", full: true },
    { name: "colors", label: "Available colours", type: "csv", help: "Comma separated", full: true },
    { name: "customization", label: "Customisation notes", type: "textarea", optional: true, full: true },
    { name: "image_url", label: "Primary image", type: "image", optional: true, full: true },
    { name: "gallery", label: "Gallery images", type: "csv", help: "Image URLs, comma separated — first one is shown first", optional: true, full: true },
    { name: "specifications", label: "Specifications", type: "json", help: 'JSON object, e.g. {"GSM":"180"}', optional: true, full: true },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_featured", label: "Featured product", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "keywords", label: "Keywords", type: "text", optional: true, full: true },
    ...seoFields,
  ],
};

export const BLOG_POST_RESOURCE: ResourceDef = {
  table: "blog_posts",
  title: "Blog posts",
  description: "Published articles appear on /blog, in search and in the sitemap with full SEO metadata.",
  columns: [
    { name: "title", label: "Title" },
    { name: "category_id", label: "Topic" },
    { name: "published_at", label: "Published" },
    { name: "is_featured", label: "Featured" },
    { name: "is_published", label: "Published" },
  ],
  defaults: { is_published: false, is_featured: false, read_minutes: 5, sort_order: 0, author: "Rare Signs Apparel", content: "" },
  fields: [
    { name: "title", label: "Title", type: "text", full: true },
    { name: "slug", label: "Slug", type: "slug", help: "/blog/your-slug" },
    { name: "author", label: "Author", type: "text" },
    { name: "category_id", label: "Topic", type: "ref", refKey: "blog_categories", optional: true },
    { name: "read_minutes", label: "Read minutes", type: "number" },
    { name: "excerpt", label: "Excerpt", type: "textarea", optional: true, full: true },
    { name: "cover_image_url", label: "Featured image", type: "image", optional: true, full: true },
    { name: "content", label: "Content (markdown)", type: "markdown", full: true },
    { name: "published_at", label: "Publish date", type: "date", optional: true },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_featured", label: "Featured article", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "keywords", label: "Keywords", type: "text", optional: true, full: true },
    ...seoFields,
  ],
};

export const BLOG_CATEGORY_RESOURCE: ResourceDef = {
  table: "blog_categories",
  title: "Blog topics",
  description: "Topic filters shown above the article list.",
  sortable: true,
  columns: [
    { name: "name", label: "Name" },
    { name: "slug", label: "Slug" },
    { name: "sort_order", label: "Order" },
    { name: "is_active", label: "Active" },
  ],
  defaults: { is_active: true, sort_order: 0 },
  fields: [
    { name: "name", label: "Topic name", type: "text" },
    { name: "slug", label: "Slug", type: "slug" },
    { name: "description", label: "Description", type: "textarea", optional: true, full: true },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Visible on website", type: "boolean" },
  ],
};

export const BLOG_TAG_RESOURCE: ResourceDef = {
  table: "blog_tags",
  title: "Blog tags",
  description: "Tags that can be attached to articles.",
  columns: [
    { name: "name", label: "Name" },
    { name: "slug", label: "Slug" },
  ],
  fields: [
    { name: "name", label: "Tag name", type: "text" },
    { name: "slug", label: "Slug", type: "slug" },
  ],
};

export const FAQ_RESOURCE: ResourceDef = {
  table: "faqs",
  title: "FAQs",
  description: "Questions shown on the FAQ page and the homepage FAQ block.",
  sortable: true,
  columns: [
    { name: "question", label: "Question" },
    { name: "category", label: "Group" },
    { name: "sort_order", label: "Order" },
    { name: "is_active", label: "Active" },
  ],
  defaults: { is_active: true, sort_order: 0 },
  fields: [
    { name: "question", label: "Question", type: "text", full: true },
    { name: "answer", label: "Answer", type: "textarea", full: true },
    { name: "category", label: "Group", type: "text", optional: true },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Visible on website", type: "boolean" },
  ],
};

export const TESTIMONIAL_RESOURCE: ResourceDef = {
  table: "testimonials",
  title: "Testimonials",
  description: "Client quotes shown on the homepage.",
  sortable: true,
  columns: [
    { name: "author", label: "Author" },
    { name: "company", label: "Company" },
    { name: "country", label: "Country" },
    { name: "sort_order", label: "Order" },
    { name: "is_active", label: "Active" },
  ],
  defaults: { is_active: true, sort_order: 0, rating: 5 },
  fields: [
    { name: "author", label: "Author", type: "text" },
    { name: "role", label: "Role", type: "text", optional: true },
    { name: "company", label: "Company", type: "text", optional: true },
    { name: "country", label: "Country", type: "text", optional: true },
    { name: "rating", label: "Rating (1-5)", type: "number" },
    { name: "quote", label: "Quote", type: "textarea", full: true },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Visible on website", type: "boolean" },
  ],
};

export const EXPORT_COUNTRY_RESOURCE: ResourceDef = {
  table: "export_countries",
  title: "Export markets",
  description: "Markets plotted on the world map and listed on the export markets page.",
  sortable: true,
  columns: [
    { name: "name", label: "Country" },
    { name: "code", label: "Code" },
    { name: "region", label: "Region" },
    { name: "sort_order", label: "Order" },
    { name: "is_active", label: "Active" },
  ],
  defaults: { is_active: true, sort_order: 0, lat: 0, lng: 0 },
  fields: [
    { name: "name", label: "Country", type: "text" },
    { name: "code", label: "ISO code", type: "text" },
    { name: "region", label: "Region", type: "text", optional: true },
    { name: "lat", label: "Latitude", type: "number" },
    { name: "lng", label: "Longitude", type: "number" },
    { name: "sort_order", label: "Display order", type: "number" },
    { name: "is_active", label: "Visible on website", type: "boolean" },
  ],
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
