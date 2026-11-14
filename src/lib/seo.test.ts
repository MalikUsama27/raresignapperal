import { describe, expect, test } from "bun:test";
import { COMPANY_FACTS } from "./company";
import { absoluteImageUrl, permanentRedirect, publicPath, storedProductSlug, storedSubcategorySlug } from "./seo";

describe("confirmed company facts", () => {
  test("40+ export markets", () => expect(COMPANY_FACTS.markets).toBe(40));
  test("20,000 units per month", () => expect(COMPANY_FACTS.unitsPerMonth).toBe(20000));
  test("50+ in-house team", () => expect(COMPANY_FACTS.team).toBe(50));
  test("10 Yrs experience", () => expect(COMPANY_FACTS.experienceYears).toBe(10));
  test("established in 2017", () => expect(COMPANY_FACTS.establishedYear).toBe(2017));
});

test("existing absolute image location is preserved", () => {
  expect(absoluteImageUrl("https://media.example.org/products/kit.jpg?version=2")).toBe("https://media.example.org/products/kit.jpg?version=2");
  expect(absoluteImageUrl("/images/kit.jpg")).toBe("https://raresignsapparel.com/images/kit.jpg");
  expect(absoluteImageUrl("javascript:alert(1)")).toBeNull();
});

test("www permanent destination preserves path and query without a loop", () => {
  expect(permanentRedirect("https://www.raresignsapparel.com/products?category=sportswear&page=2")).toBe("https://raresignsapparel.com/products?category=sportswear&page=2");
  expect(permanentRedirect("https://raresignsapparel.com/products?page=2")).toBeNull();
});

test("legacy product spelling retains its existing database record", () => {
  expect(publicPath("/products/sports-wretling-singlets")).toBe("/products/sports-wrestling-singlets");
  expect(storedProductSlug("sports-wrestling-singlets")).toBe("sports-wretling-singlets");
});

test("legacy subcategory spelling retains its existing database record", () => {
  expect(permanentRedirect("https://raresignsapparel.com/category/outdoor-wear/puffer-jackts?ref=google")).toBe("https://raresignsapparel.com/category/outdoor-wear/puffer-jackets?ref=google");
  expect(storedSubcategorySlug("puffer-jackets")).toBe("puffer-jackts");
});