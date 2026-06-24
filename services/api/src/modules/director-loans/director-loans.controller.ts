import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { DirectorLoanTransactionType } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { DirectorLoansService } from "./director-loans.service";

import { CreateDirectorLoanDto } from "./dto/create-director-loan.dto";
import { UpdateDirectorLoanDto } from "./dto/update-director-loan.dto";
import { CreateDirectorLoanTransactionDto } from "./dto/create-director-loan-transaction.dto";

@Controller("director-loans")
@UseGuards(JwtAuthGuard)
export class DirectorLoansController {
  constructor(private readonly directorLoansService: DirectorLoansService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateDirectorLoanDto) {
    return this.directorLoansService.create(user.userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.directorLoansService.findAll(user.userId);
  }

  @Get(":id")
  findOne(@CurrentUser() user: any, @Param("id") id: string) {
    return this.directorLoansService.findOne(user.userId, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: UpdateDirectorLoanDto,
  ) {
    return this.directorLoansService.update(user.userId, id, dto);
  }

  @Delete(":id")
  remove(@CurrentUser() user: any, @Param("id") id: string) {
    return this.directorLoansService.remove(user.userId, id);
  }

  @Get(":id/transactions")
  getTransactions(@CurrentUser() user: any, @Param("id") id: string) {
    return this.directorLoansService.getTransactions(user.userId, id);
  }

  @Post(":id/drawdown")
  drawdown(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: CreateDirectorLoanTransactionDto,
  ) {
    return this.directorLoansService.createTransaction(
      user.userId,
      id,
      DirectorLoanTransactionType.DRAWDOWN,
      dto,
    );
  }

  @Post(":id/repayment")
  repayment(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: CreateDirectorLoanTransactionDto,
  ) {
    return this.directorLoansService.createTransaction(
      user.userId,
      id,
      DirectorLoanTransactionType.REPAYMENT,
      dto,
    );
  }

  @Post(":id/adjustment")
  adjustment(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: CreateDirectorLoanTransactionDto,
  ) {
    return this.directorLoansService.createTransaction(
      user.userId,
      id,
      DirectorLoanTransactionType.ADJUSTMENT,
      dto,
    );
  }
}
