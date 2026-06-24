import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { InvoicesService } from "./invoices.service";

import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceStatusDto } from "./dto/update-invoice-status.dto";
import { CreateInvoicePaymentDto } from "./dto/create-invoice-payment.dto";

@Controller("invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateInvoiceDto
  ) {
    return this.invoicesService.create(
      user.userId,
      dto
    );
  }

  @Get("summary/dashboard")
  summary(
    @CurrentUser() user: any
  ) {
    return this.invoicesService.summary(
      user.userId
    );
  }

  @Get("receivables")
  receivables(
    @CurrentUser() user: any
  ) {
    return this.invoicesService.receivables(
      user.userId
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: any
  ) {
    return this.invoicesService.findAll(
      user.userId
    );
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: any,
    @Param("id") id: string
  ) {
    return this.invoicesService.findOne(
      user.userId,
      id
    );
  }

  @Patch(":id/status")
  updateStatus(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body()
    dto: UpdateInvoiceStatusDto
  ) {
    return this.invoicesService.updateStatus(
      user.userId,
      id,
      dto
    );
  }

  @Post(":id/payments")
  addPayment(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body()
    dto: CreateInvoicePaymentDto
  ) {
    return this.invoicesService.addPayment(
      user.userId,
      id,
      dto
    );
  }
}