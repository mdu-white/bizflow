import { apiFetch } from "./api";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;

  issueDate: string;
  dueDate: string;

  subtotalCents: number;
  vatCents: number;
  totalCents: number;

  status: string;

  client?: {
    id: string;
    name: string;
  };

  project?: {
    id: string;
    name: string;
  };
}

export async function getInvoices() {
  return apiFetch(
    "/invoices"
  ) as Promise<Invoice[]>;
}

export async function createInvoice(
  data: {
    clientId: string;
    projectId?: string;

    issueDate: string;
    dueDate: string;

    subtotalCents: number;
    vatCents: number;
    totalCents: number;

    notes?: string;

    lineItems: {
      description: string;
      quantity: number;
      unitPriceCents: number;
      lineTotalCents: number;
    }[];
  }
) {
  return apiFetch(
    "/invoices",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}