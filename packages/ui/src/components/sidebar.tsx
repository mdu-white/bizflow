import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  FileText,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  Receipt,
  Users
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Clients",
    href: "/clients",
    icon: Users
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban
  },
  {
    label: "Contractors",
    href: "/contractors",
    icon: Briefcase
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: Receipt
  },
  {
    label: "Invoices",
    href: "/invoices",
    icon: FileText
  },
  {
    label: "Receivables",
    href: "/receivables",
    icon: HandCoins
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3
  }
];

export function Sidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-xl font-bold">
          BizFlow
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Business Management Platform
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}