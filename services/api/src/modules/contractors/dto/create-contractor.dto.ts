import { ContractorStatus } from "@prisma/client";

export class CreateContractorDto {
  name!: string;

  email?: string;

  phone?: string;

  companyName?: string;

  taxNumber?: string;

  projectId?: string;

  status?: ContractorStatus;

  hourlyRateCents?: number;

  monthlyRetainerCents?: number;
}