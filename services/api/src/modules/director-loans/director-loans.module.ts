import { Module } from "@nestjs/common";

import { DirectorLoansController } from "./director-loans.controller";
import { DirectorLoansService } from "./director-loans.service";

@Module({
  controllers: [DirectorLoansController],
  providers: [DirectorLoansService]
})
export class DirectorLoansModule {}