import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import type { ReactNode } from "react";
import LiveInsightsOverlay from '../../components/LiveInsightsOverlay';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-page-gradient">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(252_59%_52%/0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(258_65%_50%/0.18),transparent)]"
        aria-hidden
      />
      <AppSidebar />
      <div className="relative flex min-h-screen flex-1 flex-col">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-4 md:p-7 lg:p-10">
          <LiveInsightsOverlay />
          <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}