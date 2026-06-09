export const ORGANIZATION_ROLES = ["OWNER", "ADMIN", "FINANCE", "PROJECT_MANAGER", "MEMBER"] as const;
export const PROJECT_STATUSES = ["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"] as const;
export const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "TRANSFER", "ADJUSTMENT"] as const;
export const DIRECTOR_LOAN_DIRECTIONS = ["TO_COMPANY", "FROM_COMPANY"] as const;
export const CONTRACTOR_STATUSES = ["ACTIVE", "INACTIVE", "ON_HOLD"] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type DirectorLoanDirection = (typeof DIRECTOR_LOAN_DIRECTIONS)[number];
export type ContractorStatus = (typeof CONTRACTOR_STATUSES)[number];

export interface TenantScoped {
  organizationId: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  organizationMemberships: Array<{
    organizationId: string;
    role: OrganizationRole;
  }>;
}

export interface ApiHealth {
  status: "ok";
  service: "bizflow-api";
}
