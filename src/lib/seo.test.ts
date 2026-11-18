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
test("old Lovable address permanently moves to the official domain", () => {
  assert.equal(permanentRedirect("https://raresignapperal.lovable.app/products?x=1"), "https://raresignsapparel.com/products?x=1");
});

test("product search puts name matches above description matches", async () => {
  const { searchScore, searchStem } = await import("./seo");
  assert.equal(searchStem("Jerseys"), "jersey");
  assert.equal(searchStem("hoodies"), "hoodie");
  const byName = searchScore({ name: "Basketball Uniforms", short_description: "" }, "basketball");
  const byText = searchScore({ name: "Training Kits", short_description: "great for basketball" }, "basketball");
  assert.ok(byName > byText);
});

import { b2bTitle, productTitle } from "./seo";
test("product titles carry buyer-intent keywords within 60 chars", () => {
  const t = b2bTitle("Elite Full Zip Hoodie");
  assert.ok(t.length <= 60 && /manufacturer/i.test(t) && t.includes("Elite Full Zip Hoodie"), t);
  assert.ok(b2bTitle("Professional Sublimated Ice Hockey Jerseys Premium").length <= 60);
  assert.equal(productTitle("Hoodie", "Hoodie Manufacturer UK | Rare Signs Apparel"), "Hoodie Manufacturer UK | Rare Signs Apparel");
  assert.match(productTitle("Hoodie", "Hoodie | Export"), /Custom Hoodie Manufacturer/);
});

import { imageAlt } from "./seo";
test("image alt text carries buyer intent and brand", () => {
  assert.equal(imageAlt("product", "Elite Hoodie", { category: "Hoodies" }), "Custom Elite Hoodie manufacturer – Hoodies – Rare Signs Apparel");
  assert.match(imageAlt("product", "Elite Hoodie", { index: 2 }), /back view/);
  assert.equal(imageAlt("category", "Tracksuits"), "Wholesale Tracksuits supplier – Rare Signs Apparel");
});
