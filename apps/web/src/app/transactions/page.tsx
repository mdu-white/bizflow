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
  Sidebar
} from "@bizflow/ui";

import { getCurrentUser } from "../../lib/auth";

import {
  getClients,
  type Client
} from "../../lib/clients";

import {
  getProjects,
  type Project
} from "../../lib/projects";

import {
  createTransaction,
  getTransactions,
  type Transaction
} from "../../lib/transactions";

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [type, setType] =
    useState("INCOME");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [clientId, setClientId] =
    useState("");

  const [projectId, setProjectId] =
    useState("");

  const [userName, setUserName] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  async function loadTransactions() {
    const data =
      await getTransactions();

    setTransactions(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        const me =
          await getCurrentUser();

        setUserName(
          me.user.name
        );

        setOrganizationName(
          me.organization.name
        );

        const clientData =
          await getClients();

        setClients(clientData);

        const projectData =
          await getProjects();

        setProjects(projectData);

        await loadTransactions();
      } catch (error) {
        console.error(error);
      }
    }

    void initialize();
  }, []);

  async function handleCreateTransaction() {
    if (!description.trim()) {
      return;
    }

    const amountValue =
      Number(amount);

    if (
      Number.isNaN(amountValue) ||
      amountValue <= 0
    ) {
      return;
    }

    await createTransaction({
      type,
      description,

      amountCents:
        Math.round(
          amountValue * 100
        ),

      occurredAt:
        new Date().toISOString(),

      clientId:
        clientId || undefined,

      projectId:
        projectId || undefined
    });

    setDescription("");
    setAmount("");
    setClientId("");
    setProjectId("");

    await loadTransactions();
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Transactions"
          subtitle="Track income and expenses"
          userName={userName}
          organizationName={organizationName}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>
            Create Transaction
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value
                )
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="INCOME">
                Income
              </option>

              <option value="EXPENSE">
                Expense
              </option>
            </select>

            <select
              value={clientId}
              onChange={(event) =>
                setClientId(
                  event.target.value
                )
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">
                No Client
              </option>

              {clients.map(
                (client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </option>
                )
              )}
            </select>

            <select
              value={projectId}
              onChange={(event) =>
                setProjectId(
                  event.target.value
                )
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">
                No Project
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                )
              )}
            </select>

            <input
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Description"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              type="number"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="Amount"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <Button
              onClick={
                handleCreateTransaction
              }
            >
              Create Transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Transactions
            </CardTitle>
          </CardHeader>

          <CardContent>
            {transactions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No transactions found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map(
                  (transaction) => (
                    <div
                      key={transaction.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <p className="font-medium">
                        {transaction.description}
                      </p>

                      <p className="text-sm text-slate-500">
                        Type: {transaction.type}
                      </p>

                      <p className="text-sm text-slate-500">
                        Status: {transaction.status}
                      </p>

                      <p className="text-sm text-slate-500">
                        Amount: R
                        {(
                          transaction.amountCents /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}