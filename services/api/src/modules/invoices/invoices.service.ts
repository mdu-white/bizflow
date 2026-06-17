import { Injectable, NotFoundException } from "@nestjs/common";

import { TransactionStatus, TransactionType } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { OrganizationContextService } from "../common/services/organization-context.service";

import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceStatusDto } from "./dto/update-invoice-status.dto";
import { CreateInvoicePaymentDto } from "./dto/create-invoice-payment.dto";

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationContext: OrganizationContextService,
  ) {}

  private async generateInvoiceNumber(organizationId: string) {
    const year = new Date().getFullYear();

    const count = await this.prisma.invoice.count({
      where: {
        organizationId,
      },
    });

    const sequence = String(count + 1).padStart(6, "0");

    return `INV-${year}-${sequence}`;
  }

  async create(userId: string, dto: CreateInvoiceDto) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    const invoiceNumber = await this.generateInvoiceNumber(organizationId);

    return this.prisma.invoice.create({
      data: {
        organizationId,
        clientId: dto.clientId,
        projectId: dto.projectId,
        invoiceNumber,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        subtotalCents: dto.subtotalCents,
        vatCents: dto.vatCents,
        totalCents: dto.totalCents,
        notes: dto.notes,
        createdByUserId: userId,

        lineItems: {
          create: dto.lineItems,
        },
      },
      include: {
        client: true,
        project: true,
        lineItems: true,
        payments: true,
      },
    });
  }

  async summary(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        payments: true,
      },
    });

    const now = new Date();

    let totalInvoicedCents = 0;
    let totalPaidCents = 0;
    let outstandingCents = 0;
    let overdueInvoices = 0;

    for (const invoice of invoices) {
      totalInvoicedCents += invoice.totalCents;

      const paid = invoice.payments.reduce(
        (sum, payment) => sum + payment.amountCents,
        0,
      );

      totalPaidCents += paid;

      const outstanding = Math.max(invoice.totalCents - paid, 0);

      outstandingCents += outstanding;

      if (outstanding > 0 && invoice.dueDate < now) {
        overdueInvoices++;
      }
    }

    return {
      totalInvoices: invoices.length,
      totalInvoicedCents,
      totalPaidCents,
      outstandingCents,
      overdueInvoices,
    };
  }

  async receivables(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    const invoices = await this.prisma.invoice.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        client: true,
        payments: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const now = new Date();

    return invoices.map((invoice) => {
      const paid = invoice.payments.reduce(
        (sum, payment) => sum + payment.amountCents,
        0,
      );

      const outstanding = Math.max(invoice.totalCents - paid, 0);

      const daysOverdue =
        outstanding > 0 && invoice.dueDate < now
          ? Math.floor((now.getTime() - invoice.dueDate.getTime()) / 86400000)
          : 0;

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.name,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        totalCents: invoice.totalCents,
        paidCents: paid,
        outstandingCents: outstanding,
        daysOverdue,
        status: invoice.status,
      };
    });
  }

  async findAll(userId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    return this.prisma.invoice.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        client: true,
        project: true,
        lineItems: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(userId: string, invoiceId: string) {
    const organizationId =
      await this.organizationContext.getOrganizationId(userId);

    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        organizationId,
        deletedAt: null,
      },
      include: {
        client: true,
        project: true,
        lineItems: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    return invoice;
  }

  async updateStatus(
    userId: string,
    invoiceId: string,
    dto: UpdateInvoiceStatusDto,
  ) {
    await this.findOne(userId, invoiceId);

    return this.prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: dto.status,
        sentAt: dto.status === "SENT" ? new Date() : undefined,
        sentByUserId: dto.status === "SENT" ? userId : undefined,
      },
    });
  }

  async addPayment(
    userId: string,
    invoiceId: string,
    dto: CreateInvoicePaymentDto,
  ) {
    const invoice = await this.findOne(userId, invoiceId);

    await this.prisma.invoicePayment.create({
      data: {
        invoiceId,
        amountCents: dto.amountCents,
        paymentDate: dto.paymentDate,
        reference: dto.reference,
        notes: dto.notes,
      },
    });

    await this.prisma.transaction.create({
      data: {
        organizationId: invoice.organizationId,
        clientId: invoice.clientId,
        projectId: invoice.projectId,
        createdByUserId: userId,
        invoiceId: invoice.id,
        type: TransactionType.INCOME,
        status: TransactionStatus.POSTED,
        occurredAt: dto.paymentDate,
        description: `Invoice Payment - ${invoice.invoiceNumber}`,
        amountCents: dto.amountCents,
        currency: "ZAR",
        postedAt: new Date(),
        postedByUserId: userId,
      },
    });

    const totals = await this.prisma.invoicePayment.aggregate({
      where: {
        invoiceId,
      },
      _sum: {
        amountCents: true,
      },
    });

    const paidAmount = totals._sum.amountCents ?? 0;

    let status = invoice.status;

    if (paidAmount >= invoice.totalCents) {
      status = "PAID";
    } else if (paidAmount > 0) {
      status = "PARTIALLY_PAID";
    }

    await this.prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status,
      },
    });

    return this.findOne(userId, invoiceId);
  }
}
