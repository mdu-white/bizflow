import { apiFetch } from "./api";

export interface Project {
  id: string;
  name: string;
  code?: string;
  description?: string;
  clientId?: string;
  status?: string;
  budgetCents?: number;
}

export async function getProjects() {
  return apiFetch(
    "/projects"
  ) as Promise<Project[]>;
}

export async function createProject(
  data: {
    name: string;
    code?: string;
    description?: string;
    clientId?: string;
  }
) {
  return apiFetch(
    "/projects",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}