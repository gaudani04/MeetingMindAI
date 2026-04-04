"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/auth-context";
import { Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "./theme-toggle";

function initialsFromEmail(email: string | null) {
  if (!email) return "?";
  const local = email.split("@")[0] ?? email;
  const parts = local.split(/[.\-_]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  }
  return local.slice(0, 2).toUpperCase();
}

export function TopNavbar() {
  const { email, logout } = useAuth();
  const router = useRouter();
  const initials = initialsFromEmail(email);

  function handleSignOut() {
    logout();
    router.push("/landing");
    router.refresh();
  }

  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/80 bg-white/75 px-4 shadow-soft backdrop-blur-2xl dark:border-cyan-500/10 dark:bg-[#0a0c10]/80 md:px-6 lg:px-8">
        <div className="relative flex max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search meetings, transcripts, actions…"
            className="h-10 border-border/60 bg-white/85 pl-10 shadow-soft transition-all focus-visible:border-cyan-500/40 focus-visible:shadow-soft-lg md:max-w-xl dark:bg-slate-950/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full border-border/60 bg-white/80 shadow-soft transition-all hover:scale-105 hover:shadow-soft-lg dark:bg-slate-950/50"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse-soft rounded-full bg-cyan-400 ring-2 ring-background dark:bg-cyan-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Avatar className="h-9 w-9 cursor-pointer border border-cyan-500/30 shadow-soft">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 font-display text-sm font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-panel">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-0.5">
                  <span className="font-display text-sm font-semibold">
                    Account
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {email ?? "Signed in"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
