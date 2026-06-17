import {
  Injectable,
  NotFoundException
} from "@nestjs/common";

import {
  DirectorLoanStatus,
  DirectorLoanTransactionType
} from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";
import { AuditService } from "../audit/audit.service";

import { CreateDirectorLoanDto } from "./dto/create-director-loan.dto";
import { UpdateDirectorLoanDto } from "./dto/update-director-loan.dto";
import { CreateDirectorLoanTransactionDto } from "./dto/create-director-loan-transaction.dto";
import { calculateBalance } from "./director-loan.utils";

@Injectable()
export class DirectorLoansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService,
    private readonly auditService: AuditService
  ) {}

  async create(
    userId: string,
    dto: CreateDirectorLoanDto
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    const account =
      await this.prisma.directorLoanAccount.create({
        data: {
          organizationId,
          directorName: dto.directorName,
          directorExternalRef: dto.directorExternalRef,
          currency: dto.currency ?? "ZAR",
          notes: dto.notes,
          status: DirectorLoanStatus.OPEN
        }
      });

    await this.auditService.createEvent(
      organizationId,
      userId,
      "DIRECTOR_LOAN",
      account.id,
      "DIRECTOR_LOAN_CREATED"
    );

    return account;
  }

  async findAll(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    return this.prisma.directorLoanAccount.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      orderBy: {
        directorName: "asc"
      }
    });
  }

  async findOne(
    userId: string,
    accountId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    const account =
      await this.prisma.directorLoanAccount.findFirst({
        where: {
          id: accountId,
          organizationId,
          deletedAt: null
        }
      });

    if (!account) {
      throw new NotFoundException(
        "Director loan account not found"
      );
    }

    return account;
  }

  async update(
    userId: string,
    accountId: string,
    dto: UpdateDirectorLoanDto
  ) {
    const account =
      await this.findOne(
        userId,
        accountId
      );

    const updated =
      await this.prisma.directorLoanAccount.update({
        where: {
          id: account.id
        },
        data: dto
      });

    await this.auditService.createEvent(
      account.organizationId,
      userId,
      "DIRECTOR_LOAN",
      account.id,
      "DIRECTOR_LOAN_UPDATED",
      dto
    );

    return updated;
  }

  async remove(
    userId: string,
    accountId: string
  ) {
    const account =
      await this.findOne(
        userId,
        accountId
      );

    const deleted =
      await this.prisma.directorLoanAccount.update({
        where: {
          id: account.id
        },
        data: {
          deletedAt: new Date()
        }
      });

    await this.auditService.createEvent(
      account.organizationId,
      userId,
      "DIRECTOR_LOAN",
      account.id,
      "DIRECTOR_LOAN_DELETED"
    );

    return deleted;
  }

  private calculateStatus(
    balance: number
  ): DirectorLoanStatus {
    if (balance === 0) {
      return DirectorLoanStatus.SETTLED;
    }

    return DirectorLoanStatus.OPEN;
  }

  async createTransaction(
    userId: string,
    accountId: string,
    type: DirectorLoanTransactionType,
    dto: CreateDirectorLoanTransactionDto
  ) {
    const account =
      await this.findOne(
        userId,
        accountId
      );

    const newBalance =
      calculateBalance(
        account.currentBalanceCents,
        dto.amountCents,
        type
      );

    const transaction =
      await this.prisma.directorLoanTransaction.create({
        data: {
          organizationId: account.organizationId,
          accountId: account.id,
          type,
          amountCents: dto.amountCents,
          balanceAfterCents: newBalance,
          currency: account.currency,
          occurredAt: dto.occurredAt,
          description: dto.description,
          reference: dto.reference
        }
      });

    await this.prisma.directorLoanAccount.update({
      where: {
        id: account.id
      },
      data: {
        currentBalanceCents: newBalance,
        status: this.calculateStatus(
          newBalance
        )
      }
    });

    await this.auditService.createEvent(
      account.organizationId,
      userId,
      "DIRECTOR_LOAN",
      account.id,
      `DIRECTOR_LOAN_${type}`
    );

    return transaction;
  }

  async getTransactions(
    userId: string,
    accountId: string
  ) {
    const account =
      await this.findOne(
        userId,
        accountId
      );

    return this.prisma.directorLoanTransaction.findMany({
      where: {
        accountId: account.id,
      },
      orderBy: {
        occurredAt: "desc"
      }
    });
  }
}