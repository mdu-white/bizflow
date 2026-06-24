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
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project
} from "../../lib/projects";

export default function ProjectsPage() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [clients, setClients] =
    useState<Client[]>([]);

  const [projectName, setProjectName] =
    useState("");

  const [clientId, setClientId] =
    useState("");

  const [editingProjectId, setEditingProjectId] =
    useState("");

  const [userName, setUserName] =
    useState("");

  const [organizationName, setOrganizationName] =
    useState("");

  async function loadProjects() {
    const data =
      await getProjects();

    setProjects(data);
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

        await loadProjects();
      } catch (error) {
        console.error(error);
      }
    }

    void initialize();
  }, []);

  async function handleCreateProject() {
    if (!projectName.trim()) {
      return;
    }

    if (!clientId) {
      return;
    }

    await createProject({
      name: projectName,
      clientId
    });

    setProjectName("");
    setClientId("");

    await loadProjects();
  }

  async function handleEditProject(
    project: Project
  ) {
    setEditingProjectId(
      project.id
    );

    setProjectName(
      project.name
    );

    setClientId(
      project.clientId
    );
  }

  async function handleSaveProject() {
    if (
      !editingProjectId ||
      !projectName.trim() ||
      !clientId
    ) {
      return;
    }

    await updateProject(
      editingProjectId,
      {
        name: projectName,
        clientId
      }
    );

    setEditingProjectId("");
    setProjectName("");
    setClientId("");

    await loadProjects();
  }

  async function handleDeleteProject(
    projectId: string
  ) {
    await deleteProject(
      projectId
    );

    if (
      editingProjectId ===
      projectId
    ) {
      setEditingProjectId("");
      setProjectName("");
      setClientId("");
    }

    await loadProjects();
  }

  function handleCancelEdit() {
    setEditingProjectId("");
    setProjectName("");
    setClientId("");
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Projects"
          subtitle="Manage client projects"
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
            {editingProjectId
              ? "Edit Project"
              : "Create Project"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <input
              value={projectName}
              onChange={(event) =>
                setProjectName(
                  event.target.value
                )
              }
              placeholder="Project Name"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

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

            <div className="flex gap-2">
              <Button
                onClick={
                  editingProjectId
                    ? handleSaveProject
                    : handleCreateProject
                }
              >
                {editingProjectId
                  ? "Save"
                  : "Create"}
              </Button>

              {editingProjectId ? (
                <Button
                  onClick={
                    handleCancelEdit
                  }
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Projects
            </CardTitle>
          </CardHeader>

          <CardContent>
            {projects.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">
                  No projects found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(
                  (project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {project.name}
                          </p>

                          {project.client ? (
                            <p className="text-sm text-slate-500">
                              Client:{" "}
                              {
                                project.client
                                  .name
                              }
                            </p>
                          ) : null}

                          {project.status ? (
                            <p className="text-sm text-slate-500">
                              {
                                project.status
                              }
                            </p>
                          ) : null}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleEditProject(
                                project
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            onClick={() =>
                              handleDeleteProject(
                                project.id
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