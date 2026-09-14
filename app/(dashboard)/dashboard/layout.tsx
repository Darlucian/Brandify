 "use client";

 import { useState } from "react";
 import Link from "next/link";
 import { usePathname } from "next/navigation";
 import { Activity, Menu, Settings, Shield, Users, ChartBarBig, Bubbles } from "lucide-react";
 import { Button } from "@/app/components/ui/button";

 const navItems = [
    { href: "/dashboard", icon: Users, label: "Overview" },
    { href: "/dashboard/general", icon: Settings, label: "General" },
    { href: "/dashboard/activity", icon: Activity, label: "Activity" },
    { href: "/dashboard/security", icon: Bubbles, label: "Integrations" },
    { href: "/dashboard/analytics", icon: Settings, label: "Settings"}
    
 ];

 export default function DashboardLayout({
    children,
 }: {
    children: React.ReactNode;
 }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="mx-auto flex min-h-100vh-73px w-full max-w-7xl">
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
             <div className="flex h-16 items-center border-b border-gray-200 px-4">
                <span className="text-lg font-semibold text-gray-900">Dashboard</span>
             </div>
             <nav className="space-y-2 p-4 h-100">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = 
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                    return(
                        <Link key={item.href} href={item.href}>
                            <Button 
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 ${
                                isActive ? "bg-gray-100 text-gray-900" : ""
                            }`}>
                                <Icon className="h-4 w-4"/>
                                {item.label}

                            </Button>
                        
                        </Link>
                    )
                })}

             </nav>
            </aside>
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                {children}
            </main>
            <div className="fixed left-4 top-20 z-50 lg:hidden">
                <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen((prev) => !prev)}>
<Menu className="h-4 w-4"/>
                </Button>

            </div>
        </div>
    )
 }