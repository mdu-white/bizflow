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

import { TransactionsService } from "./transactions.service";

import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { VoidTransactionDto } from "./dto/void-transaction.dto";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService
  ) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateTransactionDto
  ) {
    return this.transactionsService.create(
      user.userId,
      dto
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: any
  ) {
    return this.transactionsService.findAll(
      user.userId
    );
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: any,
    @Param("id") id: string
  ) {
    return this.transactionsService.findOne(
      user.userId,
      id
    );
  }

  @Patch(":id")
  update(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(
      user.userId,
      id,
      dto
    );
  }

  @Post(":id/post")
  post(
    @CurrentUser() user: any,
    @Param("id") id: string
  ) {
    return this.transactionsService.post(
      user.userId,
      id
    );
  }

  @Post(":id/void")
  void(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: VoidTransactionDto
  ) {
    return this.transactionsService.void(
      user.userId,
      id,
      dto.voidReason
    );
  }
}