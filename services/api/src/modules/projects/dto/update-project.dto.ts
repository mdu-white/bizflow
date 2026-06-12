import { ProjectStatus } from "@prisma/client";

export class UpdateProjectDto {
  name!: string;
  code?: string;
  description?: string;
  clientId?: string;

  status?: ProjectStatus;

  startsAt?: Date;
  endsAt?: Date;

  budgetCents?: number;
}