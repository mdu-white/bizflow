export class CreateInvoicePaymentDto {
  amountCents!: number;

  paymentDate!: Date;

  reference?: string;

  notes?: string;
}