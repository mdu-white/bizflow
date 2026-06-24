"use client";

import { useEffect, useState } from "react";

import {
  AppShell,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Header,
  Sidebar,
} from "@bizflow/ui";

import { getCurrentUser } from "../../lib/auth";

import { getClients, type Client } from "../../lib/clients";

import { getProjects, type Project } from "../../lib/projects";

import { createInvoice, getInvoices, type Invoice } from "../../lib/invoices";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [clients, setClients] = useState<Client[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);

  const [clientId, setClientId] = useState("");

  const [projectId, setProjectId] = useState("");

  const [description, setDescription] = useState("");

  const [amount, setAmount] = useState("");

  const [userName, setUserName] = useState("");

  const [organizationName, setOrganizationName] = useState("");

  async function loadInvoices() {
    const data = await getInvoices();

    setInvoices(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        const me = await getCurrentUser();

        setUserName(me.user.name);

        setOrganizationName(me.organization.name);

        const clientData = await getClients();

        setClients(clientData);

        const projectData = await getProjects();

        setProjects(projectData);

        await loadInvoices();
      } catch (error) {
        console.error(error);
      }
    }

    void initialize();
  }, []);

  async function handleCreateInvoice() {
    if (!clientId) {
      return;
    }

    if (!description.trim()) {
      return;
    }

    const amountValue = Number(amount);

    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }

    const totalCents = Math.round(amountValue * 100);

    const issueDate = new Date();

    const dueDate = new Date();

    dueDate.setDate(dueDate.getDate() + 30);

    await createInvoice({
      clientId,

      projectId: projectId || undefined,

      issueDate: issueDate.toISOString(),

      dueDate: dueDate.toISOString(),

      subtotalCents: totalCents,

      vatCents: 0,

      totalCents,

      lineItems: [
        {
          description,
          quantity: 1,
          unitPriceCents: totalCents,
          lineTotalCents: totalCents,
        },
      ],
    });

    setClientId("");
    setProjectId("");
    setDescription("");
    setAmount("");

    await loadInvoices();
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Invoices"
          subtitle="Manage invoices and receivables"
          userName={userName}
          organizationName={organizationName}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <select
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">Select Client</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">No Project</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Invoice Description"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Amount"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>

          <CardContent>
            {invoices.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">No invoices found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium">{invoice.invoiceNumber}</p>

                    <p className="text-sm text-slate-500">
                      Client: {invoice.client?.name ?? "Unknown"}
                    </p>

                    <p className="text-sm text-slate-500">
                      Project: {invoice.project?.name ?? "None"}
                    </p>

                    <p className="text-sm text-slate-500">
                      Amount: R{(invoice.totalCents / 100).toFixed(2)}
                    </p>

                    <p className="text-sm text-slate-500">
                      Status: {invoice.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
