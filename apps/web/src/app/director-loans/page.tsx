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

import {
  createDirectorLoanAccount,
  createDirectorLoanAdjustment,
  createDirectorLoanDrawdown,
  createDirectorLoanRepayment,
  deleteDirectorLoanAccount,
  getDirectorLoanAccounts,
  getDirectorLoanTransactions,
  updateDirectorLoanAccount,
  type DirectorLoanAccount,
  type DirectorLoanTransaction,
} from "../../lib/director-loans";

function formatMoney(cents: number, currency = "ZAR") {
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

export default function DirectorLoansPage() {
  const [accounts, setAccounts] = useState<DirectorLoanAccount[]>([]);

  const [transactionsByAccount, setTransactionsByAccount] = useState<
    Record<string, DirectorLoanTransaction[]>
  >({});

  const [userName, setUserName] = useState("");

  const [organizationName, setOrganizationName] = useState("");

  const [directorName, setDirectorName] = useState("");

  const [directorExternalRef, setDirectorExternalRef] = useState("");

  const [currency, setCurrency] = useState("ZAR");

  const [notes, setNotes] = useState("");

  const [editingAccountId, setEditingAccountId] = useState("");

  const [editDirectorName, setEditDirectorName] = useState("");

  const [editDirectorExternalRef, setEditDirectorExternalRef] = useState("");

  const [editCurrency, setEditCurrency] = useState("ZAR");

  const [editNotes, setEditNotes] = useState("");

  const [selectedAccountId, setSelectedAccountId] = useState("");

  const [transactionType, setTransactionType] = useState("DRAWDOWN");

  const [transactionAmount, setTransactionAmount] = useState("");

  const [transactionDescription, setTransactionDescription] = useState("");

  const [transactionReference, setTransactionReference] = useState("");

  async function loadAccounts() {
    const data = await getDirectorLoanAccounts();

    setAccounts(data);

    if (data.length === 0) {
      setTransactionsByAccount({});
      return;
    }

    const transactionEntries = await Promise.all(
      data.map(async (account) => {
        const transactions = await getDirectorLoanTransactions(account.id);

        return [account.id, transactions] as const;
      }),
    );

    setTransactionsByAccount(Object.fromEntries(transactionEntries));
  }

  useEffect(() => {
    async function initialize() {
      try {
        const me = await getCurrentUser();

        setUserName(me.user.name);

        setOrganizationName(me.organization.name);

        await loadAccounts();
      } catch (error) {
        console.error(error);
      }
    }

    void initialize();
  }, []);

  async function handleCreateAccount() {
    if (!directorName.trim()) {
      return;
    }

    await createDirectorLoanAccount({
      directorName: directorName.trim(),
      directorExternalRef: directorExternalRef.trim() || undefined,
      currency: currency.trim() || "ZAR",
      notes: notes.trim() || undefined,
    });

    setDirectorName("");
    setDirectorExternalRef("");
    setCurrency("ZAR");
    setNotes("");

    await loadAccounts();
  }

  function openEditAccount(account: DirectorLoanAccount) {
    if (account.status === "SETTLED") {
      return;
    }

    setEditingAccountId(account.id);
    setEditDirectorName(account.directorName);
    setEditDirectorExternalRef(account.directorExternalRef ?? "");
    setEditCurrency(account.currency);
    setEditNotes(account.notes ?? "");
  }

  function cancelEditAccount() {
    setEditingAccountId("");
    setEditDirectorName("");
    setEditDirectorExternalRef("");
    setEditCurrency("ZAR");
    setEditNotes("");
  }

  async function handleSaveAccount(accountId: string) {
    const account = accounts.find((item) => item.id === accountId);

    if (!account || account.status === "SETTLED") {
      return;
    }

    if (!editDirectorName.trim()) {
      return;
    }

    await updateDirectorLoanAccount(accountId, {
      directorName: editDirectorName.trim(),
      directorExternalRef: editDirectorExternalRef.trim() || undefined,
      currency: editCurrency.trim() || "ZAR",
      notes: editNotes.trim() || undefined,
    });

    cancelEditAccount();
    await loadAccounts();
  }

  async function handleDeleteAccount(accountId: string) {
    const account = accounts.find((item) => item.id === accountId);

    if (!account || account.status === "SETTLED") {
      return;
    }

    await deleteDirectorLoanAccount(accountId);

    if (editingAccountId === accountId) {
      cancelEditAccount();
    }

    if (selectedAccountId === accountId) {
      setSelectedAccountId("");
      setTransactionType("DRAWDOWN");
      setTransactionAmount("");
      setTransactionDescription("");
      setTransactionReference("");
    }

    await loadAccounts();
  }

  async function handleCreateTransaction() {
    if (!selectedAccountId) {
      return;
    }

    const selectedAccount = accounts.find(
      (account) => account.id === selectedAccountId,
    );

    if (!selectedAccount || selectedAccount.status === "SETTLED") {
      return;
    }

    if (!transactionDescription.trim()) {
      return;
    }

    const amountValue = Number(transactionAmount);

    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }

    const payload = {
      amountCents: Math.round(amountValue * 100),
      occurredAt: new Date().toISOString(),
      description: transactionDescription.trim(),
      reference: transactionReference.trim() || undefined,
    };

    if (transactionType === "DRAWDOWN") {
      await createDirectorLoanDrawdown(selectedAccountId, payload);
    } else if (transactionType === "REPAYMENT") {
      await createDirectorLoanRepayment(selectedAccountId, payload);
    } else {
      await createDirectorLoanAdjustment(selectedAccountId, payload);
    }

    setSelectedAccountId("");
    setTransactionType("DRAWDOWN");
    setTransactionAmount("");
    setTransactionDescription("");
    setTransactionReference("");

    await loadAccounts();
  }

  const activeAccounts = accounts.filter(
    (account) => account.status !== "SETTLED",
  );

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Director Loans"
          subtitle="Manage director loan accounts and transactions"
          userName={userName}
          organizationName={organizationName}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Create Director Loan Account</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <input
              value={directorName}
              onChange={(event) => setDirectorName(event.target.value)}
              placeholder="Director Name"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={directorExternalRef}
              onChange={(event) => setDirectorExternalRef(event.target.value)}
              placeholder="Director Reference (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              placeholder="Currency"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              rows={3}
            />

            <Button onClick={handleCreateAccount}>Create Account</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Director Loan Transaction</CardTitle>
          </CardHeader>

          <CardContent>
            {activeAccounts.length === 0 ? (
              <div className="py-4">
                <p className="text-sm text-slate-500">
                  No open director loan accounts available for transactions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedAccountId}
                  onChange={(event) => setSelectedAccountId(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="">Select Account</option>

                  {activeAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.directorName}
                    </option>
                  ))}
                </select>

                <select
                  value={transactionType}
                  onChange={(event) => setTransactionType(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                >
                  <option value="DRAWDOWN">Drawdown</option>
                  <option value="REPAYMENT">Repayment</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionAmount}
                  onChange={(event) => setTransactionAmount(event.target.value)}
                  placeholder="Amount"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />

                <input
                  value={transactionDescription}
                  onChange={(event) =>
                    setTransactionDescription(event.target.value)
                  }
                  placeholder="Description"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />

                <input
                  value={transactionReference}
                  onChange={(event) =>
                    setTransactionReference(event.target.value)
                  }
                  placeholder="Reference (optional)"
                  className="w-full rounded-md border border-slate-300 px-3 py-2"
                />

                <Button onClick={handleCreateTransaction}>
                  Post Transaction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Director Loan Accounts</CardTitle>
          </CardHeader>

          <CardContent>
            {accounts.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No director loan accounts found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => {
                  const isEditing = editingAccountId === account.id;
                  const isSettled = account.status === "SETTLED";
                  const transactions = transactionsByAccount[account.id] ?? [];

                  return (
                    <div
                      key={account.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{account.directorName}</p>

                        <p className="text-sm text-slate-500">
                          Status: {account.status}
                        </p>

                        <p className="text-sm text-slate-500">
                          Balance:{" "}
                          {formatMoney(
                            account.currentBalanceCents,
                            account.currency,
                          )}
                        </p>

                        <p className="text-sm text-slate-500">
                          Reference: {account.directorExternalRef ?? "Not set"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Currency: {account.currency}
                        </p>

                        <p className="text-sm text-slate-500">
                          Notes: {account.notes ?? "None"}
                        </p>

                        {isSettled ? (
                          <p className="text-sm text-amber-600">
                            Settled accounts are locked and cannot be edited,
                            deleted, or transacted against.
                          </p>
                        ) : null}
                      </div>

                      {!isSettled ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button onClick={() => openEditAccount(account)}>
                            Edit
                          </Button>

                          <Button
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : null}

                      {isEditing ? (
                        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium">Edit Account</p>

                          <input
                            value={editDirectorName}
                            onChange={(event) =>
                              setEditDirectorName(event.target.value)
                            }
                            placeholder="Director Name"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            value={editDirectorExternalRef}
                            onChange={(event) =>
                              setEditDirectorExternalRef(event.target.value)
                            }
                            placeholder="Director Reference (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            value={editCurrency}
                            onChange={(event) =>
                              setEditCurrency(event.target.value)
                            }
                            placeholder="Currency"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <textarea
                            value={editNotes}
                            onChange={(event) =>
                              setEditNotes(event.target.value)
                            }
                            placeholder="Notes (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                            rows={3}
                          />

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSaveAccount(account.id)}
                            >
                              Save
                            </Button>

                            <Button onClick={cancelEditAccount}>Cancel</Button>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-6 border-t border-slate-200 pt-4">
                        <p className="mb-3 text-sm font-medium">
                          Transaction History
                        </p>

                        {transactions.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No transactions recorded.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {transactions.map((transaction) => (
                              <div
                                key={transaction.id}
                                className="rounded-md border border-slate-200 p-3"
                              >
                                <p className="font-medium">
                                  {transaction.type}
                                </p>

                                <p className="text-sm text-slate-500">
                                  Amount:{" "}
                                  {formatMoney(
                                    transaction.amountCents,
                                    transaction.currency,
                                  )}
                                </p>

                                <p className="text-sm text-slate-500">
                                  Balance After:{" "}
                                  {formatMoney(
                                    transaction.balanceAfterCents,
                                    transaction.currency,
                                  )}
                                </p>

                                <p className="text-sm text-slate-500">
                                  Description: {transaction.description}
                                </p>

                                <p className="text-sm text-slate-500">
                                  Reference: {transaction.reference ?? "None"}
                                </p>

                                <p className="text-sm text-slate-500">
                                  Occurred At:{" "}
                                  {new Date(
                                    transaction.occurredAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
