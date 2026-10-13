"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, BookCopyIcon, Shield, Menu, SettingsIcon, CircleDollarSign, SparklesIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/discover", icon: Compass, label: "Discover" },
  { href: "/dashboard/templates", icon: BookCopyIcon, label: "Templates" },
  { href: "/dashboard/security", icon: Shield, label: "Integrations" },
  { href: "/dashboard/pricing", icon: CircleDollarSign, label: "Pricing"},
  { href: "/dashboard/settings", icon: SettingsIcon, label: "Settings"},
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-7xl">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#241C1C]/10 bg-[#FBF8F4] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-[#241C1C]/10 px-6">
          <span className="font-sans text-lg font-bold text-[#241C1C]">
            My Dashboard
          </span>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 font-normal ${
                    isActive
                      ? "bg-[#1B4B43]/10 text-[#1B4B43] font-semibold"
                      : "text-[#6B5F5A] hover:bg-[#241C1C]/5 hover:text-[#241C1C]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:pl-6">
        {children}
      </main>

      <div className="fixed left-4 top-20 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="border-[#241C1C]/15 bg-[#FBF8F4] text-[#241C1C]"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
