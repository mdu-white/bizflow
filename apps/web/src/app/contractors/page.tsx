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

export default function ContractorsPage() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Contractors"
          subtitle="Manage contractors and external resources"
        />
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Contractor Register</h2>

          <p className="text-sm text-slate-500">All active contractors</p>
        </div>

        <Button>New Contractor</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contractors</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-12 text-center">
            <p className="text-slate-500">No contractors found.</p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
