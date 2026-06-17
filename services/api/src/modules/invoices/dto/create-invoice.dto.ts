import { InvoiceStatus } from "@prisma/client";

export class CreateInvoiceDto {
  clientId!: string;

  projectId?: string;

  invoiceNumber!: string;

  issueDate!: Date;
  dueDate!: Date;

  subtotalCents!: number;
  vatCents!: number;
  totalCents!: number;

  notes?: string;

  status?: InvoiceStatus;

  lineItems!: {
    description: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }[];
}