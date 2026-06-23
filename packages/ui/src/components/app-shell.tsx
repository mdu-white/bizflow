import * as React from "react";

import { cn } from "../lib/utils";

export interface AppShellProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({
  sidebar,
  header,
  children,
  className
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white lg:block">
          {sidebar}
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white">
            {header}
          </header>

          <main
            className={cn(
              "flex-1 p-6",
              className
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}