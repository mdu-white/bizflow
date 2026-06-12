import {
  TransactionStatus,
  TransactionType
} from "@prisma/client";

export class CreateTransactionDto {
  type!: TransactionType;

  description!: string;

  amountCents!: number;

  occurredAt!: Date;

  clientId?: string;

  projectId?: string;

  internalReference?: string;

  externalReference?: string;

  currency?: string;

  vatRateBasisPts?: number;

  vatAmountCents?: number;

  status?: TransactionStatus;
}