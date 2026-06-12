import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
