import { AppShellBackground } from "@/components/layout/app-shell-background";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import type { ReactNode } from "react";
import LiveInsightsOverlay from '../../components/LiveInsightsOverlay';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-page-gradient">
      <AppShellBackground />
      <AppSidebar />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-4 md:p-7 lg:p-10">
          <LiveInsightsOverlay />
          <div className="mx-auto max-w-6xl motion-reduce:animate-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}