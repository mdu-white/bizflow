import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService
  ) {}

  async getProfitAndLoss(
    userId: string,
    from: Date,
    to: Date
    ) {
        const organizationId =
        await this.organizationContext.getOrganizationId(
        userId
        );

        const transactions =
        await this.prisma.transaction.findMany({
            where: {
                organizationId,
                status: "POSTED",
                occurredAt: {
                    gte: from,
                    lte: to
                }
            }
        });

        const incomeCents =
        transactions
        .filter(
        transaction =>
          transaction.type === "INCOME"
        )
        .reduce(
            (sum, transaction) =>
            sum + transaction.amountCents,
            0
        );

        const expenseCents =
        transactions
        .filter(
            transaction =>
            transaction.type === "EXPENSE"
        )
        .reduce(
            (sum, transaction) =>
            sum + transaction.amountCents,
            0
        );

        return {
            incomeCents,
            expenseCents,
            profitCents:
                incomeCents - expenseCents,
            transactionCount:
                transactions.length
        };
    }

    async getCashFlow(
  userId: string,
  from: Date,
  to: Date
) {
  const organizationId =
    await this.organizationContext.getOrganizationId(
      userId
    );

  const transactions =
    await this.prisma.transaction.findMany({
      where: {
        organizationId,
        status: "POSTED",
        occurredAt: {
          gte: from,
          lte: to
        }
      }
    });

  const inflowCents =
    transactions
      .filter(
        transaction =>
          transaction.type === "INCOME"
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amountCents,
        0
      );

  const outflowCents =
    transactions
      .filter(
        transaction =>
          transaction.type === "EXPENSE"
      )
      .reduce(
        (sum, transaction) =>
          sum + transaction.amountCents,
        0
      );

  return {
    inflowCents,
    outflowCents,
    netCashFlowCents:
      inflowCents - outflowCents,
    transactionCount:
      transactions.length
  };
}

  async getDirectorLoanSummary(
  userId: string
) {
  const organizationId =
    await this.organizationContext.getOrganizationId(
      userId
    );

  const accounts =
    await this.prisma.directorLoanAccount.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      orderBy: {
        directorName: "asc"
      }
    });

  const totalBalanceCents =
    accounts.reduce(
      (sum, account) =>
        sum + account.currentBalanceCents,
      0
    );

  return {
    accounts,
    totalBalanceCents
  };
}

  async getProjectProfitability(
    userId: string
  ) {
    return [];
  }
}