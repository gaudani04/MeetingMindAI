import { AppShellBackground } from "@/components/layout/app-shell-background";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page-gradient">
      <AppShellBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
