"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Forms" },
  { href: "/dashboard/submissions", label: "Submissions" },
  { href: "/dashboard/connectors", label: "Connectors" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="flex items-center gap-5 text-sm">
      {NAV_LINKS.map((link) => {
        const active = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 hover:underline ${active ? "font-medium text-accent" : ""}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent" : "bg-black/20 dark:bg-white/20"}`} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
