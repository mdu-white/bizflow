export declare const ORGANIZATION_ROLES: readonly ["OWNER", "ADMIN", "FINANCE", "PROJECT_MANAGER", "MEMBER"];
export declare const PROJECT_STATUSES: readonly ["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];
export declare const TRANSACTION_TYPES: readonly ["INCOME", "EXPENSE", "TRANSFER", "ADJUSTMENT"];
export declare const DIRECTOR_LOAN_TRANSACTION_TYPES: readonly ["DRAWDOWN", "REPAYMENT", "ADJUSTMENT"];
export declare const CONTRACTOR_STATUSES: readonly ["ACTIVE", "INACTIVE", "ON_HOLD"];
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
export type DirectorLoanTransactionType = (typeof DIRECTOR_LOAN_TRANSACTION_TYPES)[number];
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
