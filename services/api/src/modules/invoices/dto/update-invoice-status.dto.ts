import { InvoiceStatus } from "@prisma/client";

export class UpdateInvoiceStatusDto {
  status!: InvoiceStatus;
}