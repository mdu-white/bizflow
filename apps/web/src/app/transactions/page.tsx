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

export default function TransactionsPage() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Transactions"
          subtitle="Track income and expenses"
        />
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Transaction Register
          </h2>

          <p className="text-sm text-slate-500">
            All financial transactions
          </p>
        </div>

        <Button>
          New Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Transactions
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-12 text-center">
            <p className="text-slate-500">
              No transactions found.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}