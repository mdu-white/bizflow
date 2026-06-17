import {
  Controller,
  Get,
  Query,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { ReportsService } from "./reports.service";

@Controller("reports")
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService
  ) {}

  @Get("profit-loss")
  getProfitAndLoss(
    @CurrentUser() user: any,
    @Query("from") from: string,
    @Query("to") to: string
  ) {
    return this.reportsService.getProfitAndLoss(
      user.userId,
      new Date(from),
      new Date(to)
    );
  }

  @Get("cash-flow")
  getCashFlow(
    @CurrentUser() user: any,
    @Query("from") from: string,
    @Query("to") to: string
  ) {
    return this.reportsService.getCashFlow(
      user.userId,
      new Date(from),
      new Date(to)
    );
  }

  @Get("director-loans")
  getDirectorLoans(
    @CurrentUser() user: any
  ) {
    return this.reportsService.getDirectorLoanSummary(
      user.userId
    );
  }

  @Get("project-profitability")
  getProjectProfitability(
    @CurrentUser() user: any
  ) {
    return this.reportsService.getProjectProfitability(
      user.userId
    );
  }
}