import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { COMPANY_FACTS } from "./company";
import { absoluteImageUrl, permanentRedirect, publicPath, storedProductSlug, storedSubcategorySlug } from "./seo";

describe("confirmed company facts", () => {
  test("40+ export markets", () => assert.equal(COMPANY_FACTS.markets, 40));
  test("20,000 units per month", () => assert.equal(COMPANY_FACTS.unitsPerMonth, 20000));
  test("50+ in-house team", () => assert.equal(COMPANY_FACTS.team, 50));
  test("10 Yrs experience", () => assert.equal(COMPANY_FACTS.experienceYears, 10));
  test("established in 2017", () => assert.equal(COMPANY_FACTS.establishedYear, 2017));
});

test("existing absolute image location is preserved", () => {
  assert.equal(absoluteImageUrl("https://media.example.org/products/kit.jpg?version=2"), "https://media.example.org/products/kit.jpg?version=2");
  assert.equal(absoluteImageUrl("/images/kit.jpg"), "https://raresignsapparel.com/images/kit.jpg");
  assert.equal(absoluteImageUrl("javascript:alert(1)"), null);
});

test("www permanent destination preserves path and query without a loop", () => {
  assert.equal(permanentRedirect("https://www.raresignsapparel.com/products?category=sportswear&page=2"), "https://raresignsapparel.com/products?category=sportswear&page=2");
  assert.equal(permanentRedirect("https://raresignsapparel.com/products?page=2"), null);
});

test("legacy product spelling retains its existing database record", () => {
  assert.equal(publicPath("/products/sports-wretling-singlets"), "/products/sports-wrestling-singlets");
  assert.equal(storedProductSlug("sports-wrestling-singlets"), "sports-wretling-singlets");
});

test("legacy subcategory spelling retains its existing database record", () => {
  assert.equal(permanentRedirect("https://raresignsapparel.com/category/outdoor-wear/puffer-jackts?ref=google"), "https://raresignsapparel.com/category/outdoor-wear/puffer-jackets?ref=google");
  assert.equal(storedSubcategorySlug("puffer-jackets"), "puffer-jackts");
});