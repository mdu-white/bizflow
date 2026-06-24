import { apiFetch } from "./api";

export interface Project {
  id: string;
  name: string;
  code?: string;
  description?: string;

  clientId: string;

  status?: string;

  budgetCents?: number;

  client?: {
    id: string;
    name: string;
  };
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
    clientId: string;
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

export async function updateProject(
  id: string,
  data: {
    name: string;
    code?: string;
    description?: string;
    clientId?: string;
    status?: string;
    budgetCents?: number;
  }
) {
  return apiFetch(
    `/projects/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data)
    }
  );
}

export async function deleteProject(
  id: string
) {
  return apiFetch(
    `/projects/${id}`,
    {
      method: "DELETE"
    }
  );
}