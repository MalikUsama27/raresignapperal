import { test } from "node:test";
import assert from "node:assert/strict";
import { sourcingGuideFor } from "./sourcing-guide";

test("basketball ranges link to the basketball buyer guide", () => {
  assert.equal(sourcingGuideFor("Basketball Uniforms").guides[0]?.slug, "custom-basketball-uniforms-bulk-guide");
});
test("hoodie ranges link to the winter wholesale guide", () => {
  assert.equal(sourcingGuideFor("Hoodies", "Casual Wear").guides[0]?.slug, "winter-hoodies-tracksuits-wholesale-guide");
});
