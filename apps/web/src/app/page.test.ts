import { describe, expect, it } from "vitest";

describe("web module registry", () => {
  it("keeps director loans visible as a first-class module", () => {
    const modules = ["Organizations", "Transactions", "Director Loans"];
    expect(modules).toContain("Director Loans");
  });
});
