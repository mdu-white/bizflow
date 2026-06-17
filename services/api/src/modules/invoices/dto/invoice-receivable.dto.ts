export class InvoiceReceivableDto {
  id!: string;

  invoiceNumber!: string;

  clientName!: string;

  issueDate!: Date;

  dueDate!: Date;

  totalCents!: number;

  paidCents!: number;

  outstandingCents!: number;

  daysOverdue!: number;

  status!: string;
}