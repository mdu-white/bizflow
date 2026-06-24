import { apiFetch } from "./api";

export interface Transaction {
  id: string;

  type: string;
  status: string;

  description: string;

  amountCents: number;

  occurredAt: string;

  currency?: string;

  vatRateBasisPts?: number;
  vatAmountCents?: number;

  internalReference?: string;
  externalReference?: string;

  voidReason?: string;
  postedAt?: string;
  voidedAt?: string;

  clientId?: string;
  projectId?: string;

  client?: {
    id: string;
    name: string;
  };

  project?: {
    id: string;
    name: string;
  };
}

export async function getTransactions() {
  return apiFetch(
    "/transactions"
  ) as Promise<Transaction[]>;
}

export async function createTransaction(
  data: {
    type: string;
    description: string;
    amountCents: number;
    occurredAt: string;

    clientId?: string;
    projectId?: string;

    internalReference?: string;
    externalReference?: string;

    currency?: string;
    vatRateBasisPts?: number;
    vatAmountCents?: number;

    status?: string;
  }
) {
  return apiFetch(
    "/transactions",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  ) as Promise<Transaction>;
}

export async function updateTransaction(
  id: string,
  data: {
    type?: string;
    description?: string;
    amountCents?: number;
    occurredAt?: string;

    clientId?: string;
    projectId?: string;

    internalReference?: string;
    externalReference?: string;

    currency?: string;
    vatRateBasisPts?: number;
    vatAmountCents?: number;
  }
) {
  return apiFetch(
    `/transactions/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data)
    }
  ) as Promise<Transaction>;
}

export async function postTransaction(
  id: string
) {
  return apiFetch(
    `/transactions/${id}/post`,
    {
      method: "POST"
    }
  ) as Promise<Transaction>;
}

export async function voidTransaction(
  id: string,
  voidReason: string
) {
  return apiFetch(
    `/transactions/${id}/void`,
    {
      method: "POST",
      body: JSON.stringify({
        voidReason
      })
    }
  ) as Promise<Transaction>;
}