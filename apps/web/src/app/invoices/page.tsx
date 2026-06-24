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
import { getClients, type Client } from "../../lib/clients";
import { getProjects, type Project } from "../../lib/projects";

import {
  addInvoicePayment,
  createInvoice,
  getInvoices,
  updateInvoiceStatus,
  type Invoice
} from "../../lib/invoices";

export default function InvoicesPage() {
  const [invoices, setInvoices] =
    useState<Invoice[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [clientId, setClientId] =
    useState("");

  const [projectId, setProjectId] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [userName, setUserName] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  const [paymentInvoiceId, setPaymentInvoiceId] =
    useState("");

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentReference, setPaymentReference] =
    useState("");

  const [paymentError, setPaymentError] =
    useState("");

  const filteredProjects = useMemo(() => {
    if (!clientId) {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.clientId === clientId
    );
  }, [projects, clientId]);

  async function loadInvoices() {
    const data =
      await getInvoices();

    setInvoices(data);
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

    const amountValue =
      Number(amount);

    if (
      Number.isNaN(amountValue) ||
      amountValue <= 0
    ) {
      return;
    }

    const totalCents =
      Math.round(amountValue * 100);

    const issueDate =
      new Date();

    const dueDate =
      new Date();

    dueDate.setDate(
      dueDate.getDate() + 30
    );

    await createInvoice({
      clientId,
      projectId:
        projectId || undefined,
      issueDate:
        issueDate.toISOString(),
      dueDate:
        dueDate.toISOString(),
      subtotalCents: totalCents,
      vatCents: 0,
      totalCents,
      lineItems: [
        {
          description,
          quantity: 1,
          unitPriceCents:
            totalCents,
          lineTotalCents:
            totalCents
        }
      ]
    });

    setClientId("");
    setProjectId("");
    setDescription("");
    setAmount("");

    await loadInvoices();
  }

  async function handleMarkSent(
    invoiceId: string
  ) {
    await updateInvoiceStatus(
      invoiceId,
      "SENT"
    );

    await loadInvoices();
  }

  async function handleVoidInvoice(
    invoiceId: string
  ) {
    await updateInvoiceStatus(
      invoiceId,
      "VOID"
    );

    if (
      paymentInvoiceId ===
      invoiceId
    ) {
      setPaymentInvoiceId("");
      setPaymentAmount("");
      setPaymentReference("");
      setPaymentError("");
    }

    await loadInvoices();
  }

  async function handleOpenPayment(
    invoice: Invoice
  ) {
    const outstandingCents =
      getOutstandingAmount(invoice);

    setPaymentInvoiceId(
      invoice.id
    );

    setPaymentAmount(
      (outstandingCents / 100).toFixed(
        2
      )
    );

    setPaymentReference("");
    setPaymentError("");
  }

  function handleCancelPayment() {
    setPaymentInvoiceId("");
    setPaymentAmount("");
    setPaymentReference("");
    setPaymentError("");
  }

  async function handleAddPayment(
    invoice: Invoice
  ) {
    if (
      paymentInvoiceId !==
      invoice.id
    ) {
      return;
    }

    const amountValue =
      Number(paymentAmount);

    if (
      Number.isNaN(amountValue) ||
      amountValue <= 0
    ) {
      setPaymentError(
        "Enter a valid payment amount."
      );
      return;
    }

    const amountCents =
      Math.round(amountValue * 100);

    const outstandingCents =
      getOutstandingAmount(invoice);

    if (
      amountCents >
      outstandingCents
    ) {
      setPaymentError(
        `Payment cannot exceed outstanding amount of R${(
          outstandingCents / 100
        ).toFixed(2)}.`
      );
      return;
    }

    setPaymentError("");

    await addInvoicePayment(
      invoice.id,
      {
        amountCents,
        paymentDate:
          new Date().toISOString(),
        reference:
          paymentReference.trim() ||
          undefined
      }
    );

    setPaymentInvoiceId("");
    setPaymentAmount("");
    setPaymentReference("");
    setPaymentError("");

    await loadInvoices();
  }

  function getPaidAmount(
    invoice: Invoice
  ) {
    return (
      invoice.payments?.reduce(
        (sum, payment) =>
          sum +
          payment.amountCents,
        0
      ) ?? 0
    );
  }

  function getOutstandingAmount(
    invoice: Invoice
  ) {
    return Math.max(
      invoice.totalCents -
        getPaidAmount(invoice),
      0
    );
  }

  function canMarkSent(
    invoice: Invoice
  ) {
    return invoice.status === "DRAFT";
  }

  function canVoid(
    invoice: Invoice
  ) {
    return (
      invoice.status === "DRAFT" ||
      invoice.status === "SENT"
    );
  }

  function canAddPayment(
    invoice: Invoice
  ) {
    return (
      invoice.status === "SENT" ||
      invoice.status ===
        "PARTIALLY_PAID"
    );
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Invoices"
          subtitle="Manage invoices and receivables"
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
            Create Invoice
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
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
                Select Client
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

              {filteredProjects.map(
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
              placeholder="Invoice Description"
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

            <Button
              onClick={
                handleCreateInvoice
              }
            >
              Create Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Invoices
            </CardTitle>
          </CardHeader>

          <CardContent>
            {invoices.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No invoices found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map(
                  (invoice) => {
                    const paidCents =
                      getPaidAmount(
                        invoice
                      );

                    const outstandingCents =
                      getOutstandingAmount(
                        invoice
                      );

                    const isPaymentOpen =
                      paymentInvoiceId ===
                      invoice.id;

                    return (
                      <div
                        key={invoice.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {
                                invoice.invoiceNumber
                              }
                            </p>

                            <p className="text-sm text-slate-500">
                              Client:{" "}
                              {invoice
                                .client
                                ?.name ??
                                "Unknown"}
                            </p>

                            <p className="text-sm text-slate-500">
                              Project:{" "}
                              {invoice
                                .project
                                ?.name ??
                                "None"}
                            </p>

                            <p className="text-sm text-slate-500">
                              Amount: R
                              {(
                                invoice.totalCents /
                                100
                              ).toFixed(2)}
                            </p>

                            <p className="text-sm text-slate-500">
                              Paid: R
                              {(
                                paidCents /
                                100
                              ).toFixed(2)}
                            </p>

                            <p className="text-sm text-slate-500">
                              Outstanding: R
                              {(
                                outstandingCents /
                                100
                              ).toFixed(2)}
                            </p>

                            <p className="text-sm text-slate-500">
                              Status:{" "}
                              {
                                invoice.status
                              }
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {canMarkSent(
                              invoice
                            ) ? (
                              <Button
                                onClick={() =>
                                  handleMarkSent(
                                    invoice.id
                                  )
                                }
                              >
                                Mark Sent
                              </Button>
                            ) : null}

                            {canVoid(
                              invoice
                            ) ? (
                              <Button
                                onClick={() =>
                                  handleVoidInvoice(
                                    invoice.id
                                  )
                                }
                              >
                                Void
                              </Button>
                            ) : null}

                            {canAddPayment(
                              invoice
                            ) ? (
                              <Button
                                onClick={() =>
                                  handleOpenPayment(
                                    invoice
                                  )
                                }
                              >
                                Add Payment
                              </Button>
                            ) : null}
                          </div>
                        </div>

                        {isPaymentOpen ? (
                          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                            <p className="text-sm font-medium">
                              Record Payment
                            </p>

                            <p className="text-sm text-slate-500">
                              Outstanding:
                              {" "}
                              R
                              {(
                                outstandingCents /
                                100
                              ).toFixed(2)}
                            </p>

                            <input
                              type="number"
                              min="0"
                              max={(
                                outstandingCents /
                                100
                              ).toFixed(2)}
                              step="0.01"
                              value={
                                paymentAmount
                              }
                              onChange={(
                                event
                              ) => {
                                setPaymentAmount(
                                  event.target
                                    .value
                                );

                                if (
                                  paymentError
                                ) {
                                  setPaymentError(
                                    ""
                                  );
                                }
                              }}
                              placeholder="Payment Amount"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <input
                              value={
                                paymentReference
                              }
                              onChange={(
                                event
                              ) =>
                                setPaymentReference(
                                  event.target
                                    .value
                                )
                              }
                              placeholder="Reference (optional)"
                              className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            {paymentError ? (
                              <p className="text-sm text-red-600">
                                {
                                  paymentError
                                }
                              </p>
                            ) : null}

                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  handleAddPayment(
                                    invoice
                                  )
                                }
                              >
                                Save Payment
                              </Button>

                              <Button
                                onClick={
                                  handleCancelPayment
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