import { apiFetch } from "./api";

export interface Contractor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  taxNumber?: string;
  projectId?: string;
  status: string;
  hourlyRateCents?: number;
  monthlyRetainerCents?: number;

  project?: {
    id: string;
    name: string;
  };
}

export async function getContractors() {
  return apiFetch(
    "/contractors"
  ) as Promise<Contractor[]>;
}

export async function createContractor(
  data: {
    name: string;
    email?: string;
    phone?: string;
    companyName?: string;
    taxNumber?: string;
    projectId?: string;
    status?: string;
    hourlyRateCents?: number;
    monthlyRetainerCents?: number;
  }
) {
  return apiFetch(
    "/contractors",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  ) as Promise<Contractor>;
}

export async function updateContractor(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    taxNumber?: string;
    projectId?: string;
    status?: string;
    hourlyRateCents?: number;
    monthlyRetainerCents?: number;
  }
) {
  return apiFetch(
    `/contractors/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data)
    }
  ) as Promise<Contractor>;
}

export async function terminateContractor(
  id: string
) {
  return apiFetch(
    `/contractors/${id}/terminate`,
    {
      method: "POST"
    }
  ) as Promise<Contractor>;
}

export async function deleteContractor(
  id: string
) {
  return apiFetch(
    `/contractors/${id}`,
    {
      method: "DELETE"
    }
  ) as Promise<Contractor>;
}