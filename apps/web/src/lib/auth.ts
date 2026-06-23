import { apiFetch } from "./api";

export interface CurrentUser {
  user: {
    id: string;
    email: string;
    name: string;
  };
  organization: {
    id: string;
    name: string;
  };
  role: string;
}

export async function getCurrentUser() {
  return apiFetch(
    "/auth/me"
  ) as Promise<CurrentUser>;
}