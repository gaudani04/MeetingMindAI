"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export function LandingNav() {
  const { email } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#0a0c10]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/landing"
          className="flex items-center gap-2.5 text-slate-900 transition-opacity hover:opacity-90 dark:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/35 bg-gradient-to-br from-slate-200 to-slate-400/90 shadow-[0_0_20px_-4px_rgba(8,145,178,0.35)] dark:border-cyan-400/30 dark:from-slate-700/80 dark:to-slate-900 dark:shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)]">
            <MessageSquare className="h-4 w-4 text-cyan-700 dark:text-cyan-300" aria-hidden />
          </span>
          <span className="font-display text-sm font-bold tracking-tight md:text-base">
            MeetingMind<span className="text-cyan-600 dark:text-cyan-400/90">AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          {email ? (
            <Button
              asChild
              variant="outline"
              className="hidden border-cyan-500/45 bg-cyan-500/10 text-cyan-800 shadow-sm hover:bg-cyan-500/15 dark:border-cyan-400/35 dark:bg-cyan-500/10 dark:text-cyan-100 dark:hover:bg-cyan-500/15 sm:inline-flex"
            >
              <Link href="/">Workspace</Link>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            className="hidden text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white sm:inline-flex"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="border border-cyan-500/50 bg-cyan-500/15 text-cyan-900 shadow-sm transition-all hover:border-cyan-600/60 hover:bg-cyan-500/25 dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-100 dark:shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)] dark:hover:border-cyan-400/60 dark:hover:bg-cyan-500/15"
          >
            <Link href="/signup">Get started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
