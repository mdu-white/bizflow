import { apiFetch } from "./api";

export interface Transaction {
  id: string;

  type: string;
  status: string;

  description: string;

  amountCents: number;

  occurredAt: string;

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
  }
) {
  return apiFetch(
    "/transactions",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}