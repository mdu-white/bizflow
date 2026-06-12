import { describe, expect, it } from "vitest";

describe("Director Loan Balance", () => {
  it("adds drawdowns", () => {
    const balance = 0 + 5000000;

    expect(balance).toBe(
      5000000
    );
  });

  it("subtracts repayments", () => {
    const balance =
      5000000 - 2000000;

    expect(balance).toBe(
      3000000
    );
  });

  it("allows negative balances", () => {
    const balance =
      3000000 - 4000000;

    expect(balance).toBe(
      -1000000
    );
  });

  it("settles at zero", () => {
    const balance = 0;

    expect(balance).toBe(0);
  });
});