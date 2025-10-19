"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { 
  Trophy, 
  Users, 
  Shield, 
  Activity, 
  MessageCircle, 
  Link as LinkIcon,
  Home,
  Settings,
  BarChart3
} from "lucide-react";
import { TABLE_CATEGORIES, type TableCategory } from "@/lib/api";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

const categoryIcons = {
  Trophy,
  Users,
  Shield,
  Activity,
  MessageCircle,
  Link: LinkIcon,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold">BatBliz Admin</h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            {/* Main Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Main
              </h3>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>

            {/* Table Categories */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Data Management
              </h3>
              <SidebarMenu>
                {Object.entries(TABLE_CATEGORIES).map(([key, category]) => {
                  const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
                  const categoryKey = key as TableCategory;
                  const isActive = pathname.startsWith(`/dashboard/tables/${categoryKey.toLowerCase()}`);
                  
                  return (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton 
                        asChild
                        isActive={isActive}
                      >
                        <Link href={`/dashboard/tables/${categoryKey.toLowerCase()}`}>
                          <Icon className="h-4 w-4" />
                          <span>{category.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
