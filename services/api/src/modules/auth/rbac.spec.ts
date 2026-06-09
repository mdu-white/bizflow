import { describe, expect, it } from "vitest";
import { hasOrganizationRole } from "./rbac";

describe("RBAC", () => {
  it("allows stronger organization roles to perform lower-privilege actions", () => {
    expect(hasOrganizationRole("OWNER", "FINANCE")).toBe(true);
    expect(hasOrganizationRole("MEMBER", "ADMIN")).toBe(false);
  });
});
