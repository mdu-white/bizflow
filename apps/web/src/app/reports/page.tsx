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

export default function ReportsPage() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Reports"
          subtitle="Business insights and reporting"
        />
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Reports Centre
          </h2>

          <p className="text-sm text-slate-500">
            Generate and review business reports
          </p>
        </div>

        <Button>
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Reports
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-12 text-center">
            <p className="text-slate-500">
              No reports available.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}