"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { MeetingProvider } from "@/contexts/meeting-context";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <MeetingProvider>{children}</MeetingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
