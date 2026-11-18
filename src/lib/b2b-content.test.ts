import { describe, expect, it } from "vitest";
import { b2bContentFor } from "./b2b-content";
describe("b2bContentFor", () => {
  it("matches seasonal products", () => {
    expect(b2bContentFor("Elite Full Zip Hoodie")?.specs[0]?.[1]).toContain("320–380 GSM");
    expect(b2bContentFor("Prime Basketball Uniforms")?.specs[0]?.[1]).toContain("180–220 GSM");
    expect(b2bContentFor("Team Tracksuit")?.specs[0]?.[1]).toContain("280–320 GSM");
    expect(b2bContentFor("Soccer Jersey")).toBeNull();
  });
});
