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

import {
  getCurrentUser,
  type CurrentUser
} from "../../lib/auth";

import {
  getDashboard,
  type DashboardData
} from "../../lib/dashboard";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(
      null
    );

  useEffect(() => {
    async function loadData() {
      try {
        const [
          user,
          dashboardData
        ] = await Promise.all([
          getCurrentUser(),
          getDashboard()
        ]);

        setCurrentUser(user);
        setDashboard(
          dashboardData
        );
      } catch (error) {
        console.error(error);
      }
    }

    void loadData();
  }, []);

  function formatCurrency(
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
          title="Dashboard"
          subtitle="Business overview and financial summary"
          userName={
            currentUser?.user.name
          }
          organizationName={
            currentUser?.organization
              .name
          }
        />
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(
                dashboard?.revenueThisMonthCents ??
                  0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Profit
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {formatCurrency(
                dashboard?.profitThisMonthCents ??
                  0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Projects
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {dashboard?.activeProjects ??
                0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Clients
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {dashboard?.activeClients ??
                0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Top Projects
            </CardTitle>
          </CardHeader>

          <CardContent>
            {!dashboard ||
            dashboard.topProjects
              .length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No project data
                  available.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.topProjects.map(
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
                        Profit:{" "}
                        {formatCurrency(
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