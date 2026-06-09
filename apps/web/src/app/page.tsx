import { Button } from "@bizflow/ui";

const modules = [
  "Organizations",
  "Users",
  "Members",
  "Clients",
  "Projects",
  "Transactions",
  "Director Loans",
  "Contractors"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
            South African SME operations
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">BizFlow SA</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            A multi-tenant operating platform for managing companies, clients, projects, transactions,
            contractors, and director loans from one organization-scoped system.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Open dashboard</Button>
            <Button variant="outline">Review architecture</Button>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <div key={module} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-800">{module}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
