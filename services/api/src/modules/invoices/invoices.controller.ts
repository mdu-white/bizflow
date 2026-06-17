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
    @Body() dto: UpdateInvoiceStatusDto
  ) {
    return this.invoicesService.updateStatus(
      user.userId,
      id,
      dto
    );
  }
}