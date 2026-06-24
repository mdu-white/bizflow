import { apiFetch } from "./api";

export interface ProfitAndLossReport {
  incomeCents: number;
  expenseCents: number;
  profitCents: number;
  transactionCount: number;
}

export interface CashFlowReport {
  inflowCents: number;
  outflowCents: number;
  netCashFlowCents: number;
  transactionCount: number;
}

export interface DirectorLoanReport {
  accounts: {
    id: string;
    directorName: string;
    currentBalanceCents: number;
  }[];

  totalBalanceCents: number;
}

export interface ProjectProfitability {
  projectId: string;
  projectName: string;
  status: string;

  revenueCents: number;
  expenseCents: number;
  profitCents: number;

  marginPercent: number;
}

export async function getProfitAndLoss(
  from: string,
  to: string
) {
  return apiFetch(
    `/reports/profit-loss?from=${from}&to=${to}`
  ) as Promise<ProfitAndLossReport>;
}

export async function getCashFlow(
  from: string,
  to: string
) {
  return apiFetch(
    `/reports/cash-flow?from=${from}&to=${to}`
  ) as Promise<CashFlowReport>;
}

export async function getDirectorLoans() {
  return apiFetch(
    "/reports/director-loans"
  ) as Promise<DirectorLoanReport>;
}

export async function getProjectProfitability() {
  return apiFetch(
    "/reports/project-profitability"
  ) as Promise<ProjectProfitability[]>;
}