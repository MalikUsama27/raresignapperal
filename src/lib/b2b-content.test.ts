import { test } from "node:test";
import assert from "node:assert/strict";
import { b2bContentFor } from "./b2b-content";

test("b2bContentFor matches seasonal products", () => {
  assert.match(b2bContentFor("Elite Full Zip Hoodie")?.specs[0]?.[1] ?? "", /320–380 GSM/);
  assert.match(b2bContentFor("Prime Basketball Uniforms")?.specs[0]?.[1] ?? "", /180–220 GSM/);
  assert.match(b2bContentFor("Team Tracksuit")?.specs[0]?.[1] ?? "", /280–320 GSM/);
  assert.match(b2bContentFor("Elite Soccer Football Uniforms")?.specs[0]?.[1] ?? "", /140–180 GSM/);
  assert.deepEqual(b2bContentFor("Elite American Football Uniforms")?.markets, ["usa"]);
  assert.match(b2bContentFor("Ice Hockey Uniforms")?.faqs[0]?.q ?? "", /goalie/);
  assert.match(b2bContentFor("Crew Neck Jersey")?.specs[0]?.[1] ?? "", /Chosen per style/);
});
