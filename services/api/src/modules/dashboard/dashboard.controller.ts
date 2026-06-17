import {
  Controller,
  Get,
  UseGuards
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService
  ) {}

  @Get()
  getDashboard(
    @CurrentUser() user: any
  ) {
    return this.dashboardService.getDashboard(
      user.userId
    );
  }
}