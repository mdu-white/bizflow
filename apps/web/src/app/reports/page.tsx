"use client";

import { useEffect, useState } from "react";

import {
  AppShell,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Header,
  Sidebar
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
  type ProjectProfitability
} from "../../lib/reports";

export default function ReportsPage() {
  const [userName, setUserName] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  const [profitLoss, setProfitLoss] =
    useState<ProfitAndLossReport | null>(
      null
    );

  const [cashFlow, setCashFlow] =
    useState<CashFlowReport | null>(
      null
    );

  const [directorLoans, setDirectorLoans] =
    useState<DirectorLoanReport | null>(
      null
    );

  const [projects, setProjects] =
    useState<ProjectProfitability[]>(
      []
    );

  useEffect(() => {
    async function loadData() {
      try {
        const me =
          await getCurrentUser();

        setUserName(
          me.user.name
        );

        setOrganizationName(
          me.organization.name
        );

        const now =
          new Date();

        const startOfMonth =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          );

        const from =
          startOfMonth.toISOString();

        const to =
          now.toISOString();

        const [
          pnl,
          cash,
          loans,
          profitability
        ] = await Promise.all([
          getProfitAndLoss(
            from,
            to
          ),
          getCashFlow(
            from,
            to
          ),
          getDirectorLoans(),
          getProjectProfitability()
        ]);

        setProfitLoss(pnl);
        setCashFlow(cash);
        setDirectorLoans(loans);
        setProjects(
          profitability
        );
      } catch (error) {
        console.error(error);
      }
    }

    void loadData();
  }, []);

  function money(
    cents: number
  ) {
    return `R${(
      cents / 100
    ).toFixed(2)}`;
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Reports"
          subtitle="Business insights and reporting"
          userName={userName}
          organizationName={
            organizationName
          }
        />
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Profit & Loss
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              Revenue:{" "}
              {money(
                profitLoss?.incomeCents ??
                  0
              )}
            </p>

            <p>
              Expenses:{" "}
              {money(
                profitLoss?.expenseCents ??
                  0
              )}
            </p>

            <p>
              Profit:{" "}
              {money(
                profitLoss?.profitCents ??
                  0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Cash Flow
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              Inflow:{" "}
              {money(
                cashFlow?.inflowCents ??
                  0
              )}
            </p>

            <p>
              Outflow:{" "}
              {money(
                cashFlow?.outflowCents ??
                  0
              )}
            </p>

            <p>
              Net Cash Flow:{" "}
              {money(
                cashFlow?.netCashFlowCents ??
                  0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Director Loans
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p>
              Total Balance:{" "}
              {money(
                directorLoans?.totalBalanceCents ??
                  0
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Project Profitability
            </CardTitle>
          </CardHeader>

          <CardContent>
            {projects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No project data
                  available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(
                  (project) => (
                    <div
                      key={
                        project.projectId
                      }
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <p className="font-medium">
                        {
                          project.projectName
                        }
                      </p>

                      <p className="text-sm text-slate-500">
                        Revenue:{" "}
                        {money(
                          project.revenueCents
                        )}
                      </p>

                      <p className="text-sm text-slate-500">
                        Expenses:{" "}
                        {money(
                          project.expenseCents
                        )}
                      </p>

                      <p className="text-sm text-slate-500">
                        Profit:{" "}
                        {money(
                          project.profitCents
                        )}
                      </p>

                      <p className="text-sm text-slate-500">
                        Margin:{" "}
                        {
                          project.marginPercent
                        }
                        %
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