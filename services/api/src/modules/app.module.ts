import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ClientsModule } from "./clients/clients.module";
import { ProjectsModule } from "./projects/projects.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule,
    ProjectsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
