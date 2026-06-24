"use client";

import { useEffect, useMemo, useState } from "react";

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
  postTransaction,
  updateTransaction,
  voidTransaction,
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

  const [internalReference, setInternalReference] =
    useState("");

  const [externalReference, setExternalReference] =
    useState("");

  const [userName, setUserName] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  const [editingTransactionId, setEditingTransactionId] =
    useState("");

  const [editType, setEditType] =
    useState("INCOME");

  const [editDescription, setEditDescription] =
    useState("");

  const [editAmount, setEditAmount] =
    useState("");

  const [editClientId, setEditClientId] =
    useState("");

  const [editProjectId, setEditProjectId] =
    useState("");

  const [editInternalReference, setEditInternalReference] =
    useState("");

  const [editExternalReference, setEditExternalReference] =
    useState("");

  const [voidingTransactionId, setVoidingTransactionId] =
    useState("");

  const [voidReason, setVoidReason] =
    useState("");

  const filteredCreateProjects = useMemo(() => {
    if (!clientId) {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.clientId === clientId
    );
  }, [projects, clientId]);

  const filteredEditProjects = useMemo(() => {
    if (!editClientId) {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.clientId === editClientId
    );
  }, [projects, editClientId]);

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
        projectId || undefined,
      internalReference:
        internalReference.trim() || undefined,
      externalReference:
        externalReference.trim() || undefined
    });

    setType("INCOME");
    setDescription("");
    setAmount("");
    setClientId("");
    setProjectId("");
    setInternalReference("");
    setExternalReference("");

    await loadTransactions();
  }

  function openEditTransaction(
    transaction: Transaction
  ) {
    setEditingTransactionId(
      transaction.id
    );

    setEditType(
      transaction.type
    );

    setEditDescription(
      transaction.description
    );

    setEditAmount(
      (
        transaction.amountCents / 100
      ).toFixed(2)
    );

    setEditClientId(
      transaction.clientId ?? ""
    );

    setEditProjectId(
      transaction.projectId ?? ""
    );

    setEditInternalReference(
      transaction.internalReference ?? ""
    );

    setEditExternalReference(
      transaction.externalReference ?? ""
    );
  }

  function cancelEditTransaction() {
    setEditingTransactionId("");
    setEditType("INCOME");
    setEditDescription("");
    setEditAmount("");
    setEditClientId("");
    setEditProjectId("");
    setEditInternalReference("");
    setEditExternalReference("");
  }

  async function handleSaveTransactionEdit(
    transactionId: string
  ) {
    if (!editDescription.trim()) {
      return;
    }

    const amountValue =
      Number(editAmount);

    if (
      Number.isNaN(amountValue) ||
      amountValue <= 0
    ) {
      return;
    }

    await updateTransaction(
      transactionId,
      {
        type: editType,
        description:
          editDescription,
        amountCents:
          Math.round(
            amountValue * 100
          ),
        clientId:
          editClientId || undefined,
        projectId:
          editProjectId || undefined,
        internalReference:
          editInternalReference.trim() ||
          undefined,
        externalReference:
          editExternalReference.trim() ||
          undefined
      }
    );

    cancelEditTransaction();

    await loadTransactions();
  }

  async function handlePostTransaction(
    transactionId: string
  ) {
    await postTransaction(
      transactionId
    );

    if (
      editingTransactionId ===
      transactionId
    ) {
      cancelEditTransaction();
    }

    await loadTransactions();
  }

  function openVoidTransaction(
    transactionId: string
  ) {
    setVoidingTransactionId(
      transactionId
    );
    setVoidReason("");
  }

  function cancelVoidTransaction() {
    setVoidingTransactionId("");
    setVoidReason("");
  }

  async function handleVoidTransaction(
    transactionId: string
  ) {
    if (!voidReason.trim()) {
      return;
    }

    await voidTransaction(
      transactionId,
      voidReason.trim()
    );

    cancelVoidTransaction();

    await loadTransactions();
  }

  function formatCurrency(
    amountCents: number
  ) {
    return `R${(
      amountCents / 100
    ).toFixed(2)}`;
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Transactions"
          subtitle="Track income and expenses"
          userName={userName}
          organizationName={
            organizationName
          }
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
              onChange={(event) => {
                const nextClientId =
                  event.target.value;

                setClientId(
                  nextClientId
                );

                if (
                  projectId &&
                  !projects.some(
                    (project) =>
                      project.id ===
                        projectId &&
                      project.clientId ===
                        nextClientId
                  )
                ) {
                  setProjectId("");
                }
              }}
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

              {filteredCreateProjects.map(
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
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="Amount"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={
                internalReference
              }
              onChange={(event) =>
                setInternalReference(
                  event.target.value
                )
              }
              placeholder="Internal Reference (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={
                externalReference
              }
              onChange={(event) =>
                setExternalReference(
                  event.target.value
                )
              }
              placeholder="External Reference (optional)"
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
              <div className="space-y-4">
                {transactions.map(
                  (transaction) => {
                    const isEditing =
                      editingTransactionId ===
                      transaction.id;

                    const isVoiding =
                      voidingTransactionId ===
                      transaction.id;

                    return (
                      <div
                        key={transaction.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">
                            {
                              transaction.description
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            Type:{" "}
                            {
                              transaction.type
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            Status:{" "}
                            {
                              transaction.status
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            Amount:{" "}
                            {formatCurrency(
                              transaction.amountCents
                            )}
                          </p>

                          <p className="text-sm text-slate-500">
                            Client:{" "}
                            {transaction
                              .client
                              ?.name ??
                              "None"}
                          </p>

                          <p className="text-sm text-slate-500">
                            Project:{" "}
                            {transaction
                              .project
                              ?.name ??
                              "None"}
                          </p>

                          {transaction.internalReference ? (
                            <p className="text-sm text-slate-500">
                              Internal Ref:{" "}
                              {
                                transaction.internalReference
                              }
                            </p>
                          ) : null}

                          {transaction.externalReference ? (
                            <p className="text-sm text-slate-500">
                              External Ref:{" "}
                              {
                                transaction.externalReference
                              }
                            </p>
                          ) : null}

                          {transaction.voidReason ? (
                            <p className="text-sm text-red-600">
                              Void Reason:{" "}
                              {
                                transaction.voidReason
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {transaction.status ===
                          "DRAFT" ? (
                            <>
                              <Button
                                onClick={() =>
                                  openEditTransaction(
                                    transaction
                                  )
                                }
                              >
                                Edit
                              </Button>

                              <Button
                                onClick={() =>
                                  handlePostTransaction(
                                    transaction.id
                                  )
                                }
                              >
                                Post
                              </Button>
                            </>
                          ) : null}

                          {transaction.status ===
                          "POSTED" ? (
                            <Button
                              onClick={() =>
                                openVoidTransaction(
                                  transaction.id
                                )
                              }
                            >
                              Void
                            </Button>
                          ) : null}
                        </div>

                        {isEditing ? (
                          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                            <p className="text-sm font-medium">
                              Edit Draft Transaction
                            </p>

                            <select
                              value={editType}
                              onChange={(event) =>
                                setEditType(
                                  event.target
                                    .value
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
                              value={
                                editClientId
                              }
                              onChange={(
                                event
                              ) => {
                                const nextClientId =
                                  event.target
                                    .value;

                                setEditClientId(
                                  nextClientId
                                );

                                if (
                                  editProjectId &&
                                  !projects.some(
                                    (
                                      project
                                    ) =>
                                      project.id ===
                                        editProjectId &&
                                      project.clientId ===
                                        nextClientId
                                  )
                                ) {
                                  setEditProjectId(
                                    ""
                                  );
                                }
                              }}
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            >
                              <option value="">
                                No Client
                              </option>

                              {clients.map(
                                (
                                  client
                                ) => (
                                  <option
                                    key={
                                      client.id
                                    }
                                    value={
                                      client.id
                                    }
                                  >
                                    {
                                      client.name
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <select
                              value={
                                editProjectId
                              }
                              onChange={(
                                event
                              ) =>
                                setEditProjectId(
                                  event.target
                                    .value
                                )
                              }
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            >
                              <option value="">
                                No Project
                              </option>

                              {filteredEditProjects.map(
                                (
                                  project
                                ) => (
                                  <option
                                    key={
                                      project.id
                                    }
                                    value={
                                      project.id
                                    }
                                  >
                                    {
                                      project.name
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <input
                              value={
                                editDescription
                              }
                              onChange={(
                                event
                              ) =>
                                setEditDescription(
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Description"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                editAmount
                              }
                              onChange={(
                                event
                              ) =>
                                setEditAmount(
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Amount"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <input
                              value={
                                editInternalReference
                              }
                              onChange={(
                                event
                              ) =>
                                setEditInternalReference(
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Internal Reference (optional)"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <input
                              value={
                                editExternalReference
                              }
                              onChange={(
                                event
                              ) =>
                                setEditExternalReference(
                                  event.target
                                    .value
                                )
                              }
                              placeholder="External Reference (optional)"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleSaveTransactionEdit(
                                    transaction.id
                                  )
                                }
                              >
                                Save
                              </Button>

                              <Button
                                onClick={
                                  cancelEditTransaction
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}

                        {isVoiding ? (
                          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                            <p className="text-sm font-medium">
                              Void Posted Transaction
                            </p>

                            <input
                              value={
                                voidReason
                              }
                              onChange={(
                                event
                              ) =>
                                setVoidReason(
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Void reason"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleVoidTransaction(
                                    transaction.id
                                  )
                                }
                              >
                                Confirm Void
                              </Button>

                              <Button
                                onClick={
                                  cancelVoidTransaction
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}