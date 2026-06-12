import {
  describe,
  expect,
  it
} from "vitest";

import {
  DirectorLoanTransactionType
} from "@prisma/client";

import {
  calculateBalance
} from "../../modules/director-loans/director-loan.utils";

describe(
  "Director Loan Calculations",
  () => {

    it(
      "handles drawdowns",
      () => {
        expect(
          calculateBalance(
            0,
            5000000,
            DirectorLoanTransactionType.DRAWDOWN
          )
        ).toBe(
          5000000
        );
      }
    );

    it(
      "handles repayments",
      () => {
        expect(
          calculateBalance(
            5000000,
            2000000,
            DirectorLoanTransactionType.REPAYMENT
          )
        ).toBe(
          3000000
        );
      }
    );

    it(
      "allows negative balances",
      () => {
        expect(
          calculateBalance(
            3000000,
            4000000,
            DirectorLoanTransactionType.REPAYMENT
          )
        ).toBe(
          -1000000
        );
      }
    );

    it(
      "handles adjustments",
      () => {
        expect(
          calculateBalance(
            -1000000,
            1000000,
            DirectorLoanTransactionType.ADJUSTMENT
          )
        ).toBe(
          0
        );
      }
    );
  }
);