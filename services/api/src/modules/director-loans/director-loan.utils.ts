import { DirectorLoanTransactionType } from "@prisma/client";

export function calculateBalance(
  currentBalance: number,
  amount: number,
  type: DirectorLoanTransactionType,
): number {
  switch (type) {
    case DirectorLoanTransactionType.DRAWDOWN:
      return currentBalance + amount;

    case DirectorLoanTransactionType.REPAYMENT:
      return currentBalance - amount;

    case DirectorLoanTransactionType.ADJUSTMENT:
      return currentBalance + amount;

    default:
      return currentBalance;
  }
}
