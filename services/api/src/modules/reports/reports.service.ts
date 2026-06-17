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
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    const projects =
      await this.prisma.project.findMany({
        where: {
          organizationId,
          deletedAt: null
        },
        include: {
          transactions: {
            where: {
              status: "POSTED"
            }
          }
        }
      });

    return projects.map(
      project => {
        const revenueCents =
          project.transactions
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
          project.transactions
            .filter(
              transaction =>
                transaction.type === "EXPENSE"
            )
            .reduce(
              (sum, transaction) =>
                sum + transaction.amountCents,
              0
            );

        const profitCents =
          revenueCents - expenseCents;

        const marginPercent =
          revenueCents > 0
            ? Number(
                (
                  (profitCents /
                    revenueCents) *
                  100
                ).toFixed(2)
              )
            : 0;

        return {
          projectId: project.id,
          projectName: project.name,
          status: project.status,
          revenueCents,
          expenseCents,
          profitCents,
          marginPercent
        };
      }
    );
  }
}