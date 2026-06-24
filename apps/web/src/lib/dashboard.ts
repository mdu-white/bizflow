import { apiFetch } from "./api";

export interface DashboardData {
  activeClients: number;
  activeProjects: number;
  activeContractors: number;

  revenueThisMonthCents: number;
  expensesThisMonthCents: number;
  profitThisMonthCents: number;

  cashFlowThisMonthCents: number;

  directorLoanBalanceCents: number;

  topProjects: {
    projectId: string;
    projectName: string;
    profitCents: number;
    marginPercent: number;
  }[];
}

export async function getDashboard() {
  return apiFetch(
    "/dashboard"
  ) as Promise<DashboardData>;
}