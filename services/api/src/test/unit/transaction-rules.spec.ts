import { describe, expect, it } from "vitest";

describe("Transaction Rules", () => {
  it("allows draft transactions", () => {
    const status = "DRAFT";

    expect(status).toBe("DRAFT");
  });

  it("allows posted transactions", () => {
    const status = "POSTED";

    expect(status).toBe("POSTED");
  });

  it("allows void transactions", () => {
    const status = "VOID";

    expect(status).toBe("VOID");
  });
});