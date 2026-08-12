import { z } from "zod";

export const listProductsInput = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  subcategory: z.string().trim().max(120).optional(),
  featured: z.boolean().optional(),
  sort: z.enum(["newest", "name", "featured"]).default("featured"),
  page: z.number().int().min(1).max(500).default(1),
  perPage: z.number().int().min(1).max(48).default(12),
});

export const inquirySchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  product_id: z.string().uuid().optional().nullable(),
  product_name: z.string().trim().max(200).optional().or(z.literal("")),
  quantity: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please add a few details").max(2000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
