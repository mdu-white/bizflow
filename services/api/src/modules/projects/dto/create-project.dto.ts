import { ProjectStatus } from "@prisma/client";

export class CreateProjectDto {
  name!: string;
  code?: string;
  description?: string;
  clientId!: string;

  status?: ProjectStatus;

  startsAt?: Date;
  endsAt?: Date;

  budgetCents?: number;
}