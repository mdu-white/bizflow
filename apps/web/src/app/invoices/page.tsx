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

export default function InvoicesPage() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Invoices"
          subtitle="Manage invoices and receivables"
        />
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Invoice Register
          </h2>

          <p className="text-sm text-slate-500">
            All invoices across your organization
          </p>
        </div>

        <Button>
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Invoices
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-12 text-center">
            <p className="text-slate-500">
              No invoices found.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}