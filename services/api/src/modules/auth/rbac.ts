import type { OrganizationRole } from "@bizflow/types";

const roleRank: Record<OrganizationRole, number> = {
  OWNER: 50,
  ADMIN: 40,
  FINANCE: 30,
  PROJECT_MANAGER: 20,
  MEMBER: 10
};

export function hasOrganizationRole(userRole: OrganizationRole, requiredRole: OrganizationRole) {
  return roleRank[userRole] >= roleRank[requiredRole];
}
