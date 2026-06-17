import {
  describe,
  expect,
  it
} from "vitest";

describe(
  "Cash Flow Calculations",
  () => {
    it(
      "calculates net cash flow correctly",
      () => {
        const inflow =
          20000000;

        const outflow =
          3050000;

        const net =
          inflow - outflow;

        expect(net).toBe(
          16950000
        );
      }
    );
  }
);