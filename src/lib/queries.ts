import { queryOptions } from "@tanstack/react-query";
import { getBlogPost, listBlogPosts } from "./blog.functions";
import {
  getCategory,
  getExportCountries,
  getFaqs,
  getHomeContent,
  getNavigation,
  getProduct,
  getSiteSettings,
  getSubcategory,
  listProducts,
} from "./catalog.functions";

const HOUR = 1000 * 60 * 60;

export const navigationQuery = () =>
  queryOptions({ queryKey: ["navigation"], queryFn: () => getNavigation(), staleTime: HOUR });

export const siteSettingsQuery = () =>
  queryOptions({ queryKey: ["site-settings"], queryFn: () => getSiteSettings(), staleTime: HOUR });

export const homeContentQuery = () =>
  queryOptions({ queryKey: ["home-content"], queryFn: () => getHomeContent(), staleTime: HOUR });

export const faqsQuery = () => queryOptions({ queryKey: ["faqs"], queryFn: () => getFaqs(), staleTime: HOUR });

export const exportCountriesQuery = () =>
  queryOptions({ queryKey: ["export-countries"], queryFn: () => getExportCountries(), staleTime: HOUR });

export type ProductListParams = {
  search?: string;
  category?: string;
  subcategory?: string;
  sort?: "featured" | "name" | "newest";
  page?: number;
  perPage?: number;
};

export const productsQuery = (params: ProductListParams) =>
  queryOptions({
    queryKey: ["products", params],
    queryFn: () => listProducts({ data: params }),
    staleTime: 5 * 60 * 1000,
  });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }), staleTime: HOUR });

export const categoryQuery = (slug: string) =>
  queryOptions({ queryKey: ["category", slug], queryFn: () => getCategory({ data: { slug } }), staleTime: HOUR });

export const subcategoryQuery = (category: string, subcategory: string) =>
  queryOptions({
    queryKey: ["subcategory", category, subcategory],
    queryFn: () => getSubcategory({ data: { category, subcategory } }),
    staleTime: HOUR,
  });

export type BlogListParams = { category?: string | undefined; search?: string | undefined; limit?: number | undefined };

export const blogPostsQuery = (params: BlogListParams = {}) =>
  queryOptions({
    queryKey: ["blog-posts", params],
    queryFn: () => listBlogPosts({ data: params }),
    staleTime: 5 * 60 * 1000,
  });

export const blogPostQuery = (slug: string) =>
  queryOptions({ queryKey: ["blog-post", slug], queryFn: () => getBlogPost({ data: { slug } }), staleTime: HOUR });
