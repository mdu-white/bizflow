import { DirectorLoanStatus } from "@prisma/client";

export class UpdateDirectorLoanDto {
  directorName?: string;

  directorExternalRef?: string;

  currency?: string;

  notes?: string;

  status?: DirectorLoanStatus;
}