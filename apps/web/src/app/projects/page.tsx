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

export default function ProjectsPage() {
  return (
    <AppShell
      sidebar={<Sidebar />}
      header={
        <Header
          title="Projects"
          subtitle="Manage client projects"
        />
      }
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Project Directory
          </h2>

          <p className="text-sm text-slate-500">
            All active projects
          </p>
        </div>

        <Button>
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Projects
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-12 text-center">
            <p className="text-slate-500">
              No projects found.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}