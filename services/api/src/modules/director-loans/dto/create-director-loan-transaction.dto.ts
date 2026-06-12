export class CreateDirectorLoanTransactionDto {
  amountCents!: number;

  occurredAt!: Date;

  description!: string;

  reference?: string;
}