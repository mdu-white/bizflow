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
  createClient,
  deleteClient,
  getClients,
  updateClient,
  type Client
} from "../../lib/clients";

export default function ClientsPage() {
  const [clients, setClients] =
    useState<Client[]>([]);

  const [userName, setUserName] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  const [clientName, setClientName] =
    useState("");

  const [editingClientId, setEditingClientId] =
    useState("");

  async function loadClients() {
    const data =
      await getClients();

    setClients(data);
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

        await loadClients();
      } catch (error) {
        console.error(error);
      }
    }

    void initialize();
  }, []);

  async function handleCreateClient() {
    if (!clientName.trim()) {
      return;
    }

    await createClient({
      name: clientName
    });

    setClientName("");

    await loadClients();
  }

  async function handleEditClient(
    client: Client
  ) {
    setEditingClientId(
      client.id
    );

    setClientName(
      client.name
    );
  }

  async function handleSaveClient() {
    if (
      !editingClientId ||
      !clientName.trim()
    ) {
      return;
    }

    await updateClient(
      editingClientId,
      {
        name: clientName
      }
    );

    setEditingClientId("");
    setClientName("");

    await loadClients();
  }

  async function handleDeleteClient(
    clientId: string
  ) {
    await deleteClient(
      clientId
    );

    if (
      editingClientId ===
      clientId
    ) {
      setEditingClientId("");
      setClientName("");
    }

    await loadClients();
  }

  async function handleCancelEdit() {
    setEditingClientId("");
    setClientName("");
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Clients"
          subtitle="Manage your client portfolio"
          userName={userName}
          organizationName={
            organizationName
          }
        />
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Client Directory
          </h2>

          <p className="text-sm text-slate-500">
            All active clients
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingClientId
              ? "Edit Client"
              : "Create Client"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-3">
            <input
              value={clientName}
              onChange={(event) =>
                setClientName(
                  event.target.value
                )
              }
              placeholder="Client Name"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2"
            />

            <Button
              onClick={
                editingClientId
                  ? handleSaveClient
                  : handleCreateClient
              }
            >
              {editingClientId
                ? "Save"
                : "Create"}
            </Button>

            {editingClientId ? (
              <Button
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Clients
            </CardTitle>
          </CardHeader>

          <CardContent>
            {clients.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No clients found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {clients.map(
                  (client) => (
                    <div
                      key={client.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {client.name}
                          </p>

                          {client.email ? (
                            <p className="text-sm text-slate-500">
                              {client.email}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleEditClient(
                                client
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            onClick={() =>
                              handleDeleteClient(
                                client.id
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
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