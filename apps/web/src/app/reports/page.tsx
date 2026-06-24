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
  getCashFlow,
  getDirectorLoans,
  getProfitAndLoss,
  getProjectProfitability,
  type CashFlowReport,
  type DirectorLoanReport,
  type ProfitAndLossReport,
  type ProjectProfitability,
} from "../../lib/reports";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function buildRangeFromDateInputs(fromDate: string, toDate: string) {
  const from = new Date(`${fromDate}T00:00:00.000Z`);

  const to = new Date(`${toDate}T23:59:59.999Z`);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}

export default function ReportsPage() {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [userName, setUserName] = useState("");

  const [organizationName, setOrganizationName] = useState("");

  const [fromDate, setFromDate] = useState(toDateInputValue(startOfMonth));

  const [toDate, setToDate] = useState(toDateInputValue(now));

  const [profitLoss, setProfitLoss] = useState<ProfitAndLossReport | null>(
    null,
  );

  const [cashFlow, setCashFlow] = useState<CashFlowReport | null>(null);

  const [directorLoans, setDirectorLoans] = useState<DirectorLoanReport | null>(
    null,
  );

  const [projects, setProjects] = useState<ProjectProfitability[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  async function loadReports(range?: { from: string; to: string }) {
    const effectiveRange = range ?? buildRangeFromDateInputs(fromDate, toDate);

    setIsLoading(true);

    try {
      const [pnl, cash, loans, profitability] = await Promise.all([
        getProfitAndLoss(effectiveRange.from, effectiveRange.to),
        getCashFlow(effectiveRange.from, effectiveRange.to),
        getDirectorLoans(),
        getProjectProfitability(),
      ]);

      setProfitLoss(pnl);
      setCashFlow(cash);
      setDirectorLoans(loans);
      setProjects(profitability);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        const me = await getCurrentUser();

        setUserName(me.user.name);

        setOrganizationName(me.organization.name);

        const initialRange = buildRangeFromDateInputs(
          toDateInputValue(startOfMonth),
          toDateInputValue(now),
        );

        await loadReports(initialRange);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    void initialize();
  }, []);

  async function handleRunReports() {
    if (!fromDate || !toDate) {
      return;
    }

    if (fromDate > toDate) {
      return;
    }

    await loadReports(buildRangeFromDateInputs(fromDate, toDate));
  }

  function money(cents: number) {
    return `R${(cents / 100).toFixed(2)}`;
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Reports"
          subtitle="Business insights and reporting"
          userName={userName}
          organizationName={organizationName}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">From</label>

              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">To</label>

              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleRunReports}>Run Reports</Button>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-slate-500">
              Profit & Loss and Cash Flow use the selected date range. Director
              Loans and Project Profitability are shown using current live
              system data.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profit & Loss</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-slate-500">Loading report...</p>
            ) : (
              <div className="space-y-2">
                <p>Revenue: {money(profitLoss?.incomeCents ?? 0)}</p>

                <p>Expenses: {money(profitLoss?.expenseCents ?? 0)}</p>

                <p className="font-medium">
                  Profit: {money(profitLoss?.profitCents ?? 0)}
                </p>

                <p className="text-sm text-slate-500">
                  Transactions: {profitLoss?.transactionCount ?? 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-slate-500">Loading report...</p>
            ) : (
              <div className="space-y-2">
                <p>Inflow: {money(cashFlow?.inflowCents ?? 0)}</p>

                <p>Outflow: {money(cashFlow?.outflowCents ?? 0)}</p>

                <p className="font-medium">
                  Net Cash Flow: {money(cashFlow?.netCashFlowCents ?? 0)}
                </p>

                <p className="text-sm text-slate-500">
                  Transactions: {cashFlow?.transactionCount ?? 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Director Loans</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-slate-500">Loading report...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">
                    Total Balance:{" "}
                    {money(directorLoans?.totalBalanceCents ?? 0)}
                  </p>
                </div>

                {!directorLoans || directorLoans.accounts.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-slate-500">
                      No director loan accounts found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {directorLoans.accounts.map((account) => (
                      <div
                        key={account.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <p className="font-medium">{account.directorName}</p>

                        <p className="text-sm text-slate-500">
                          Balance: {money(account.currentBalanceCents)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Profitability</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-slate-500">Loading report...</p>
            ) : projects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">No project data available.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.projectId}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium">{project.projectName}</p>

                    <p className="text-sm text-slate-500">
                      Status: {project.status}
                    </p>

                    <p className="text-sm text-slate-500">
                      Revenue: {money(project.revenueCents)}
                    </p>

                    <p className="text-sm text-slate-500">
                      Expenses: {money(project.expenseCents)}
                    </p>

                    <p className="text-sm text-slate-500">
                      Profit: {money(project.profitCents)}
                    </p>

                    <p className="text-sm text-slate-500">
                      Margin: {project.marginPercent}%
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
