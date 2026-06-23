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

export default function ClientsPage() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Clients"
          subtitle="Manage your client portfolio"
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

        <Button>
          New Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Clients
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-12 text-center">
            <p className="text-slate-500">
              No clients found.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}