import { apiFetch } from "./api";

export interface Client {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  billingAddress?: string;
  notes?: string;
}

export async function getClients() {
  return apiFetch(
    "/clients"
  ) as Promise<Client[]>;
}

export async function createClient(
  data: {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    vatNumber?: string;
    billingAddress?: string;
    notes?: string;
  }
) {
  return apiFetch(
    "/clients",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}

export async function updateClient(
  id: string,
  data: {
    name?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    vatNumber?: string;
    billingAddress?: string;
    notes?: string;
  }
) {
  return apiFetch(
    `/clients/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data)
    }
  );
}

export async function deleteClient(
  id: string
) {
  return apiFetch(
    `/clients/${id}`,
    {
      method: "DELETE"
    }
  );
}   