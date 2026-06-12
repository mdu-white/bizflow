import {
  TransactionStatus,
  TransactionType
} from "@prisma/client";

export class UpdateTransactionDto {
  type?: TransactionType;

  description?: string;

  amountCents?: number;

  occurredAt?: Date;

  clientId?: string;

  projectId?: string;

  internalReference?: string;

  externalReference?: string;

  currency?: string;

  vatRateBasisPts?: number;

  vatAmountCents?: number;

  status?: TransactionStatus;
}