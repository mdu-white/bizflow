import {
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";

import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceStatusDto } from "./dto/update-invoice-status.dto";

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService
  ) {}

  async create(
    userId: string,
    dto: CreateInvoiceDto
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    return this.prisma.invoice.create({
      data: {
        organizationId,
        clientId: dto.clientId,
        projectId: dto.projectId,
        invoiceNumber: dto.invoiceNumber,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        subtotalCents: dto.subtotalCents,
        vatCents: dto.vatCents,
        totalCents: dto.totalCents,
        notes: dto.notes,
        createdByUserId: userId,
        lineItems: {
          create: dto.lineItems
        }
      },
      include: {
        lineItems: true
      }
    });
  }

  async findAll(
    userId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    return this.prisma.invoice.findMany({
      where: {
        organizationId,
        deletedAt: null
      },
      include: {
        client: true,
        project: true,
        lineItems: true,
        payments: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findOne(
    userId: string,
    invoiceId: string
  ) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    const invoice =
      await this.prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          organizationId,
          deletedAt: null
        },
        include: {
          client: true,
          project: true,
          lineItems: true,
          payments: true
        }
      });

    if (!invoice) {
      throw new NotFoundException(
        "Invoice not found"
      );
    }

    return invoice;
  }

  async updateStatus(
    userId: string,
    invoiceId: string,
    dto: UpdateInvoiceStatusDto
  ) {
    await this.findOne(
      userId,
      invoiceId
    );

    return this.prisma.invoice.update({
      where: {
        id: invoiceId
      },
      data: {
        status: dto.status,
        sentAt:
          dto.status === "SENT"
            ? new Date()
            : undefined,
        sentByUserId:
          dto.status === "SENT"
            ? userId
            : undefined
      }
    });
  }
}