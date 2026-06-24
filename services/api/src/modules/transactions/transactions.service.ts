import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService,
    private readonly auditService: AuditService
  ) {}

  private async validateClientAndProject(
    organizationId: string,
    data: {
      clientId?: string;
      projectId?: string;
    }
  ) {
    if (data.clientId) {
      const client =
        await this.prisma.client.findFirst({
          where: {
            id: data.clientId,
            organizationId,
            deletedAt: null
          }
        });

      if (!client) {
        throw new NotFoundException(
          "Client not found"
        );
      }
    }

    if (data.projectId) {
      const project =
        await this.prisma.project.findFirst({
          where: {
            id: data.projectId,
            organizationId,
            deletedAt: null
          }
        });

      if (!project) {
        throw new NotFoundException(
          "Project not found"
        );
      }

      if (
        data.clientId &&
        project.clientId &&
        project.clientId !==
          data.clientId
      ) {
        throw new BadRequestException(
          "Project does not belong to client"
        );
      }
    }
  }

  async create(
    userId: string,
    dto: CreateTransactionDto
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    await this.validateClientAndProject(
      organizationId,
      {
        clientId: dto.clientId,
        projectId: dto.projectId
      }
    );

    const transaction =
      await this.prisma.transaction.create({
        data: {
          organizationId,
          createdByUserId: userId,

          type: dto.type,
          status:
            dto.status ??
            "DRAFT",

          description:
            dto.description,

          amountCents:
            dto.amountCents,

          occurredAt:
            dto.occurredAt,

          currency:
            dto.currency ??
            "ZAR",

          vatRateBasisPts:
            dto.vatRateBasisPts ??
            0,

          vatAmountCents:
            dto.vatAmountCents ??
            0,

          clientId:
            dto.clientId,

          projectId:
            dto.projectId,

          internalReference:
            dto.internalReference,

          externalReference:
            dto.externalReference
        }
      });

    await this.auditService.createEvent(
      organizationId,
      userId,
      "TRANSACTION",
      transaction.id,
      "TRANSACTION_CREATED",
      {
        type: transaction.type,
        amountCents:
          transaction.amountCents
      }
    );

    return transaction;
  }

  async findAll(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    return this.prisma.transaction.findMany({
      where: {
        organizationId
      },
      include: {
        client: true,
        project: true,
        createdByUser: true,
        postedBy: true,
        voidedBy: true
      },
      orderBy: {
        occurredAt: "desc"
      }
    });
  }

  async findOne(
    userId: string,
    transactionId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(
        userId
      );

    const transaction =
      await this.prisma.transaction.findFirst({
        where: {
          id: transactionId,
          organizationId
        },
        include: {
          client: true,
          project: true,
          createdByUser: true,
          postedBy: true,
          voidedBy: true
        }
      });

    if (!transaction) {
      throw new NotFoundException(
        "Transaction not found"
      );
    }

    return transaction;
  }

  async update(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto
  ) {
    const transaction =
      await this.findOne(
        userId,
        transactionId
      );

    if (
      transaction.status !==
      "DRAFT"
    ) {
      throw new BadRequestException(
        "Only draft transactions can be edited"
      );
    }

    const nextClientId =
      dto.clientId !== undefined
        ? dto.clientId
        : transaction.clientId ?? undefined;

    const nextProjectId =
      dto.projectId !== undefined
        ? dto.projectId
        : transaction.projectId ?? undefined;

    await this.validateClientAndProject(
      transaction.organizationId,
      {
        clientId: nextClientId,
        projectId: nextProjectId
      }
    );

    const updated =
      await this.prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: dto
      });

    await this.auditService.createEvent(
      transaction.organizationId,
      userId,
      "TRANSACTION",
      updated.id,
      "TRANSACTION_UPDATED",
      dto
    );

    return updated;
  }

  async post(
    userId: string,
    transactionId: string
  ) {
    const transaction =
      await this.findOne(
        userId,
        transactionId
      );

    if (
      transaction.status !==
      "DRAFT"
    ) {
      throw new BadRequestException(
        "Only draft transactions can be posted"
      );
    }

    const posted =
      await this.prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: {
          status: "POSTED",
          postedAt: new Date(),
          postedByUserId: userId
        }
      });

    await this.auditService.createEvent(
      transaction.organizationId,
      userId,
      "TRANSACTION",
      posted.id,
      "TRANSACTION_POSTED",
      {
        amountCents:
          posted.amountCents
      }
    );

    return posted;
  }

  async void(
    userId: string,
    transactionId: string,
    voidReason: string
  ) {
    const transaction =
      await this.findOne(
        userId,
        transactionId
      );

    if (
      transaction.status !==
      "POSTED"
    ) {
      throw new BadRequestException(
        "Only posted transactions can be voided"
      );
    }

    if (!voidReason.trim()) {
      throw new BadRequestException(
        "Void reason is required"
      );
    }

    const voided =
      await this.prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: {
          status: "VOID",
          voidedAt: new Date(),
          voidedByUserId: userId,
          voidReason
        }
      });

    await this.auditService.createEvent(
      transaction.organizationId,
      userId,
      "TRANSACTION",
      voided.id,
      "TRANSACTION_VOIDED",
      {
        voidReason
      }
    );

    return voided;
  }
}