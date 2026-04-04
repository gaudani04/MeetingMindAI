"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Mic,
  Settings,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meetings", label: "Meetings", icon: Video },
  { href: "/live", label: "Live Recorder", icon: Mic },
  { href: "/chat", label: "Chat Assistant", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, email } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/landing");
    router.refresh();
  }

  return (
    <aside className="relative z-10 flex h-full w-64 shrink-0 flex-col glass-sidebar">
      <div className="flex items-center gap-3 px-5 py-6">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/35 bg-gradient-to-br from-slate-700/90 to-slate-900 text-white shadow-glow transition-transform duration-300 hover:scale-105 dark:border-cyan-400/30 dark:from-cyan-950/80 dark:to-slate-950"
        >
          <MessageSquare className="h-5 w-5 text-cyan-300" aria-hidden />
        </Link>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <p className="font-display text-base font-bold leading-tight tracking-tight">
            MeetingMind<span className="text-primary">AI</span>
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-4">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                active
                  ? "bg-gradient-to-r from-primary/15 to-cyan-500/10 text-primary shadow-soft dark:from-primary/20 dark:to-cyan-500/10"
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground dark:hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  active ? "scale-110" : "group-hover:scale-105"
                )}
                aria-hidden
              />
              {item.label}
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500 shadow-glow" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mx-3 mb-3 rounded-xl border border-dashed border-cyan-500/25 bg-gradient-to-br from-cyan-500/5 to-transparent p-3 text-xs text-muted-foreground dark:from-cyan-500/10">
        <p className="font-display font-semibold text-foreground">Pro tip</p>
        <p className="mt-1.5 leading-relaxed">
          Share a browser tab with Zoom or YouTube audio plus your mic for
          full-room capture.
        </p>
      </div>
      {email ? (
        <p className="mx-4 mb-2 truncate text-xs text-muted-foreground" title={email}>
          {email}
        </p>
      ) : null}
      <div className="px-3 pb-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
