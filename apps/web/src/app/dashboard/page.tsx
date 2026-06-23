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

export default function DashboardPage() {
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user =
          await getCurrentUser();

        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    void loadUser();
  }, []);

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
            currentUser?.organization.name
          }
        />
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Total Revenue
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              R0.00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Outstanding Invoices
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              R0.00
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
              0
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
              0
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}