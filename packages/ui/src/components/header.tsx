export interface HeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  organizationName?: string;
}

export function Header({
  title,
  subtitle,
  userName = "Admin User",
  organizationName = "Organization"
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            {userName}
          </p>

          <p className="text-xs text-slate-500">
            {organizationName}
          </p>
        </div>

        <div className="h-10 w-10 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}