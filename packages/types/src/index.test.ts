import { describe, expect, it } from "vitest";
import { ORGANIZATION_ROLES } from "./index";

describe("shared types", () => {
  it("includes the owner role for tenant administration", () => {
    expect(ORGANIZATION_ROLES).toContain("OWNER");
  });
});
