import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";
import { ProjectsModule } from "./projects/projects.module";
import { CommonModule } from "./common/comond.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { AuditModule } from "./audit/audit.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule,
    ProjectsModule,
    CommonModule,
    TransactionsModule,
    AuditModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
