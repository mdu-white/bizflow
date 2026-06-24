import { apiFetch } from "./api";

export interface DirectorLoanAccount {
  id: string;
  directorName: string;
  directorExternalRef?: string;
  currency: string;
  notes?: string;
  status: string;
  currentBalanceCents: number;
}

export interface DirectorLoanTransaction {
  id: string;
  accountId: string;
  type: string;
  amountCents: number;
  balanceAfterCents: number;
  currency: string;
  occurredAt: string;
  description: string;
  reference?: string;
  createdAt: string;
}

export async function getDirectorLoanAccounts() {
  return apiFetch("/director-loans") as Promise<DirectorLoanAccount[]>;
}

export async function createDirectorLoanAccount(data: {
  directorName: string;
  directorExternalRef?: string;
  currency?: string;
  notes?: string;
}) {
  return apiFetch("/director-loans", {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<DirectorLoanAccount>;
}

export async function updateDirectorLoanAccount(
  id: string,
  data: {
    directorName?: string;
    directorExternalRef?: string;
    currency?: string;
    notes?: string;
    status?: string;
  },
) {
  return apiFetch(`/director-loans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }) as Promise<DirectorLoanAccount>;
}

export async function deleteDirectorLoanAccount(id: string) {
  return apiFetch(`/director-loans/${id}`, {
    method: "DELETE",
  }) as Promise<DirectorLoanAccount>;
}

export async function getDirectorLoanTransactions(accountId: string) {
  return apiFetch(`/director-loans/${accountId}/transactions`) as Promise<
    DirectorLoanTransaction[]
  >;
}

export async function createDirectorLoanDrawdown(
  accountId: string,
  data: {
    amountCents: number;
    occurredAt: string;
    description: string;
    reference?: string;
  },
) {
  return apiFetch(`/director-loans/${accountId}/drawdown`, {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<DirectorLoanTransaction>;
}

export async function createDirectorLoanRepayment(
  accountId: string,
  data: {
    amountCents: number;
    occurredAt: string;
    description: string;
    reference?: string;
  },
) {
  return apiFetch(`/director-loans/${accountId}/repayment`, {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<DirectorLoanTransaction>;
}

export async function createDirectorLoanAdjustment(
  accountId: string,
  data: {
    amountCents: number;
    occurredAt: string;
    description: string;
    reference?: string;
  },
) {
  return apiFetch(`/director-loans/${accountId}/adjustment`, {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<DirectorLoanTransaction>;
}
