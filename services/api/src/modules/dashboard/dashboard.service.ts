import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService
  ) {}

  async getDashboard(
    userId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    const now = new Date();

    const startOfMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const [
      clients,
      projects,
      contractors,
      accounts,
      transactions,
      projectProfitability
    ] = await Promise.all([
      this.prisma.client.count({
        where: {
          organizationId,
          deletedAt: null
        }
      }),

      this.prisma.project.count({
        where: {
          organizationId,
          deletedAt: null
        }
      }),

      this.prisma.contractor.count({
        where: {
          organizationId,
          deletedAt: null
        }
      }),

      this.prisma.directorLoanAccount.findMany({
        where: {
          organizationId,
          deletedAt: null
        }
      }),

      this.prisma.transaction.findMany({
        where: {
          organizationId,
          status: "POSTED",
          occurredAt: {
            gte: startOfMonth
          }
        }
      }),

      this.prisma.project.findMany({
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
      })
    ]);

    const revenueThisMonthCents =
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

    const expensesThisMonthCents =
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

    const profitThisMonthCents =
      revenueThisMonthCents -
      expensesThisMonthCents;

    const directorLoanBalanceCents =
      accounts.reduce(
        (sum, account) =>
          sum + account.currentBalanceCents,
        0
      );

    const topProjects =
      projectProfitability
        .map(project => {
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
            revenueCents -
            expenseCents;

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
            profitCents,
            marginPercent
          };
        })
        .sort(
          (a, b) =>
            b.marginPercent -
            a.marginPercent
        )
        .slice(0, 5);

    return {
      activeClients: clients,
      activeProjects: projects,
      activeContractors: contractors,

      revenueThisMonthCents,
      expensesThisMonthCents,
      profitThisMonthCents,

      cashFlowThisMonthCents:
        profitThisMonthCents,

      directorLoanBalanceCents,

      topProjects
    };
  }
}