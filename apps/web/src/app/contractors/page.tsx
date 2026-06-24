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

import { getProjects, type Project } from "../../lib/projects";

import {
  createContractor,
  deleteContractor,
  getContractors,
  terminateContractor,
  updateContractor,
  type Contractor,
} from "../../lib/contractors";

function formatMoney(cents?: number) {
  if (cents === undefined || cents === null) {
    return "Not set";
  }

  return `R${(cents / 100).toFixed(2)}`;
}

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);

  const [projects, setProjects] = useState<Project[]>([]);

  const [userName, setUserName] = useState("");

  const [organizationName, setOrganizationName] = useState("");

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [companyName, setCompanyName] = useState("");

  const [taxNumber, setTaxNumber] = useState("");

  const [projectId, setProjectId] = useState("");

  const [hourlyRate, setHourlyRate] = useState("");

  const [monthlyRetainer, setMonthlyRetainer] = useState("");

  const [editingContractorId, setEditingContractorId] = useState("");

  const [editName, setEditName] = useState("");

  const [editEmail, setEditEmail] = useState("");

  const [editPhone, setEditPhone] = useState("");

  const [editCompanyName, setEditCompanyName] = useState("");

  const [editTaxNumber, setEditTaxNumber] = useState("");

  const [editProjectId, setEditProjectId] = useState("");

  const [editHourlyRate, setEditHourlyRate] = useState("");

  const [editMonthlyRetainer, setEditMonthlyRetainer] = useState("");

  async function loadContractors() {
    const data = await getContractors();

    setContractors(data);
  }

  useEffect(() => {
    async function initialize() {
      try {
        const me = await getCurrentUser();

        setUserName(me.user.name);

        setOrganizationName(me.organization.name);

        const projectData = await getProjects();

        setProjects(projectData);

        await loadContractors();
      } catch (error) {
        console.error(error);
      }
    }

    void initialize();
  }, []);

  async function handleCreateContractor() {
    if (!name.trim()) {
      return;
    }

    const hourlyRateValue = hourlyRate.trim() ? Number(hourlyRate) : undefined;

    if (
      hourlyRateValue !== undefined &&
      (Number.isNaN(hourlyRateValue) || hourlyRateValue < 0)
    ) {
      return;
    }

    const monthlyRetainerValue = monthlyRetainer.trim()
      ? Number(monthlyRetainer)
      : undefined;

    if (
      monthlyRetainerValue !== undefined &&
      (Number.isNaN(monthlyRetainerValue) || monthlyRetainerValue < 0)
    ) {
      return;
    }

    await createContractor({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      companyName: companyName.trim() || undefined,
      taxNumber: taxNumber.trim() || undefined,
      projectId: projectId || undefined,
      hourlyRateCents:
        hourlyRateValue !== undefined
          ? Math.round(hourlyRateValue * 100)
          : undefined,
      monthlyRetainerCents:
        monthlyRetainerValue !== undefined
          ? Math.round(monthlyRetainerValue * 100)
          : undefined,
    });

    setName("");
    setEmail("");
    setPhone("");
    setCompanyName("");
    setTaxNumber("");
    setProjectId("");
    setHourlyRate("");
    setMonthlyRetainer("");

    await loadContractors();
  }

  function openEditContractor(contractor: Contractor) {
    setEditingContractorId(contractor.id);

    setEditName(contractor.name);

    setEditEmail(contractor.email ?? "");

    setEditPhone(contractor.phone ?? "");

    setEditCompanyName(contractor.companyName ?? "");

    setEditTaxNumber(contractor.taxNumber ?? "");

    setEditProjectId(contractor.projectId ?? "");

    setEditHourlyRate(
      contractor.hourlyRateCents !== undefined &&
        contractor.hourlyRateCents !== null
        ? (contractor.hourlyRateCents / 100).toFixed(2)
        : "",
    );

    setEditMonthlyRetainer(
      contractor.monthlyRetainerCents !== undefined &&
        contractor.monthlyRetainerCents !== null
        ? (contractor.monthlyRetainerCents / 100).toFixed(2)
        : "",
    );
  }

  function cancelEditContractor() {
    setEditingContractorId("");
    setEditName("");
    setEditEmail("");
    setEditPhone("");
    setEditCompanyName("");
    setEditTaxNumber("");
    setEditProjectId("");
    setEditHourlyRate("");
    setEditMonthlyRetainer("");
  }

  async function handleSaveContractor(contractorId: string) {
    if (!editName.trim()) {
      return;
    }

    const hourlyRateValue = editHourlyRate.trim()
      ? Number(editHourlyRate)
      : undefined;

    if (
      hourlyRateValue !== undefined &&
      (Number.isNaN(hourlyRateValue) || hourlyRateValue < 0)
    ) {
      return;
    }

    const monthlyRetainerValue = editMonthlyRetainer.trim()
      ? Number(editMonthlyRetainer)
      : undefined;

    if (
      monthlyRetainerValue !== undefined &&
      (Number.isNaN(monthlyRetainerValue) || monthlyRetainerValue < 0)
    ) {
      return;
    }

    await updateContractor(contractorId, {
      name: editName.trim(),
      email: editEmail.trim() || undefined,
      phone: editPhone.trim() || undefined,
      companyName: editCompanyName.trim() || undefined,
      taxNumber: editTaxNumber.trim() || undefined,
      projectId: editProjectId || undefined,
      hourlyRateCents:
        hourlyRateValue !== undefined
          ? Math.round(hourlyRateValue * 100)
          : undefined,
      monthlyRetainerCents:
        monthlyRetainerValue !== undefined
          ? Math.round(monthlyRetainerValue * 100)
          : undefined,
    });

    cancelEditContractor();

    await loadContractors();
  }

  async function handleTerminateContractor(contractorId: string) {
    await terminateContractor(contractorId);

    if (editingContractorId === contractorId) {
      cancelEditContractor();
    }

    await loadContractors();
  }

  async function handleDeleteContractor(contractorId: string) {
    await deleteContractor(contractorId);

    if (editingContractorId === contractorId) {
      cancelEditContractor();
    }

    await loadContractors();
  }

  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Contractors"
          subtitle="Manage contractors and external resources"
          userName={userName}
          organizationName={organizationName}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Create Contractor</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contractor Name"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Company Name (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              value={taxNumber}
              onChange={(event) => setTaxNumber(event.target.value)}
              placeholder="Tax Number (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="">No Project</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              value={hourlyRate}
              onChange={(event) => setHourlyRate(event.target.value)}
              placeholder="Hourly Rate (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <input
              type="number"
              min="0"
              step="0.01"
              value={monthlyRetainer}
              onChange={(event) => setMonthlyRetainer(event.target.value)}
              placeholder="Monthly Retainer (optional)"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />

            <Button onClick={handleCreateContractor}>Create Contractor</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Contractors</CardTitle>
          </CardHeader>

          <CardContent>
            {contractors.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-slate-500">No contractors found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contractors.map((contractor) => {
                  const isEditing = editingContractorId === contractor.id;

                  return (
                    <div
                      key={contractor.id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{contractor.name}</p>

                        <p className="text-sm text-slate-500">
                          Status: {contractor.status}
                        </p>

                        <p className="text-sm text-slate-500">
                          Email: {contractor.email ?? "Not set"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Phone: {contractor.phone ?? "Not set"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Company: {contractor.companyName ?? "Not set"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Tax Number: {contractor.taxNumber ?? "Not set"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Project: {contractor.project?.name ?? "None"}
                        </p>

                        <p className="text-sm text-slate-500">
                          Hourly Rate: {formatMoney(contractor.hourlyRateCents)}
                        </p>

                        <p className="text-sm text-slate-500">
                          Monthly Retainer:{" "}
                          {formatMoney(contractor.monthlyRetainerCents)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => openEditContractor(contractor)}>
                          Edit
                        </Button>

                        {contractor.status !== "TERMINATED" ? (
                          <Button
                            onClick={() =>
                              handleTerminateContractor(contractor.id)
                            }
                          >
                            Terminate
                          </Button>
                        ) : null}

                        <Button
                          onClick={() => handleDeleteContractor(contractor.id)}
                        >
                          Delete
                        </Button>
                      </div>

                      {isEditing ? (
                        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium">Edit Contractor</p>

                          <input
                            value={editName}
                            onChange={(event) =>
                              setEditName(event.target.value)
                            }
                            placeholder="Contractor Name"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            value={editEmail}
                            onChange={(event) =>
                              setEditEmail(event.target.value)
                            }
                            placeholder="Email (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            value={editPhone}
                            onChange={(event) =>
                              setEditPhone(event.target.value)
                            }
                            placeholder="Phone (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            value={editCompanyName}
                            onChange={(event) =>
                              setEditCompanyName(event.target.value)
                            }
                            placeholder="Company Name (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            value={editTaxNumber}
                            onChange={(event) =>
                              setEditTaxNumber(event.target.value)
                            }
                            placeholder="Tax Number (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <select
                            value={editProjectId}
                            onChange={(event) =>
                              setEditProjectId(event.target.value)
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          >
                            <option value="">No Project</option>

                            {projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editHourlyRate}
                            onChange={(event) =>
                              setEditHourlyRate(event.target.value)
                            }
                            placeholder="Hourly Rate (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editMonthlyRetainer}
                            onChange={(event) =>
                              setEditMonthlyRetainer(event.target.value)
                            }
                            placeholder="Monthly Retainer (optional)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                          />

                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleSaveContractor(contractor.id)
                              }
                            >
                              Save
                            </Button>

                            <Button onClick={cancelEditContractor}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : null}
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
