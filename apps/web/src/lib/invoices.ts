import { apiFetch } from "./api";

export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "VOID";

export interface InvoicePayment {
  id: string;
  amountCents: number;
  paymentDate: string;
  reference?: string;
  notes?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

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

  status: InvoiceStatus;

  notes?: string;

  client?: {
    id: string;
    name: string;
  };

  project?: {
    id: string;
    name: string;
  };

  lineItems?: InvoiceLineItem[];
  payments?: InvoicePayment[];
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

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
) {
  return apiFetch(
    `/invoices/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status
      })
    }
  ) as Promise<Invoice>;
}

export async function addInvoicePayment(
  id: string,
  data: {
    amountCents: number;
    paymentDate: string;
    reference?: string;
    notes?: string;
  }
) {
  return apiFetch(
    `/invoices/${id}/payments`,
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  ) as Promise<Invoice>;
}