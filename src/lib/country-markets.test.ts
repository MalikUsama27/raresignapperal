import { test } from "node:test";
import assert from "node:assert/strict";
import { COUNTRY_MARKETS, countryMarket } from "./country-markets";

test("each country page has a buyer-intent title, products and FAQs", () => {
  assert.deepEqual(COUNTRY_MARKETS.map((m) => m.slug), ["usa", "uk", "europe", "australia"]);
  for (const m of COUNTRY_MARKETS) {
    assert.ok(m.title.length <= 60 && /manufacturer/i.test(m.title), m.title);
    assert.ok(m.products.length >= 3 && m.faqs.length >= 3);
  }
  assert.equal(countryMarket("UK")?.name, "UK");
  assert.equal(countryMarket("mars"), undefined);
});
