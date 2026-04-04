"use client";

import { RecentMeetingsTable } from "@/components/dashboard/recent-meetings-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMeetings } from "@/contexts/meeting-context";
import { Brain, Mic, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { meetings, totalTranscriptions, aiInsightsCount } = useMeetings();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white/70 via-white/45 to-cyan-500/[0.06] p-6 shadow-glow-lg ring-1 ring-white/40 backdrop-blur-xl dark:from-slate-900/55 dark:via-slate-900/35 dark:to-cyan-950/20 dark:border-white/[0.07] dark:ring-white/[0.06] md:p-9">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-fade opacity-50 motion-reduce:opacity-30"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/30 via-sky-500/20 to-blue-600/20 blur-3xl motion-safe:animate-aurora dark:from-cyan-500/25 dark:via-sky-600/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-gradient-to-tl from-indigo-500/25 to-transparent blur-3xl motion-safe:animate-aurora dark:from-indigo-500/20"
          style={{ animationDelay: "2s" }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both text-[11px] font-semibold uppercase tracking-[0.22em] text-primary duration-500 ease-out dark:text-primary/90">
              Overview
            </p>
            <h1 className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both font-display text-3xl font-bold tracking-tight text-foreground delay-75 duration-500 ease-out md:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
              <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both max-w-lg text-[15px] leading-relaxed text-muted-foreground delay-150 duration-500 ease-out md:text-base">
              Your workspace at a glance — meetings, transcripts, and AI
              insights in one calm surface.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both h-12 shrink-0 rounded-full bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 bg-[length:200%_100%] px-8 font-semibold text-white shadow-glow transition-all duration-300 ease-out hover:bg-[position:100%_0] hover:shadow-glow-lg active:scale-[0.98] motion-safe:hover:scale-[1.02] dark:from-cyan-500 dark:via-sky-500 dark:to-blue-500 delay-200"
          >
            <Link href="/live">
              <Mic className="h-4 w-4" />
              Start live session
            </Link>
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          <Skeleton className="h-40 rounded-2xl shimmer" />
          <Skeleton className="h-40 rounded-2xl shimmer" />
          <Skeleton className="h-40 rounded-2xl shimmer" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 ease-out delay-100 motion-reduce:animate-none">
            <StatCard
              title="Total meetings"
              value={meetings.length}
              hint="Across your workspace"
              icon={Video}
              gradient
            />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 ease-out delay-200 motion-reduce:animate-none">
            <StatCard
              title="Transcriptions"
              value={totalTranscriptions.toLocaleString()}
              hint="Uploads + live sessions"
              icon={Sparkles}
            />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 ease-out delay-300 motion-reduce:animate-none">
            <StatCard
              title="AI insights"
              value={aiInsightsCount.toLocaleString()}
              hint="Summaries & key points"
              icon={Brain}
            />
          </div>
        </div>
      )}

      <Card className="glass-card animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-700 ease-out delay-150 motion-reduce:animate-none">
        <CardHeader className="flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="font-display text-xl">Recent meetings</CardTitle>
            <CardDescription className="text-base">
              Jump back into notes, actions, and risk highlights.
            </CardDescription>
          </div>
          <Button variant="outline" asChild className="rounded-full border-border/80">
            <Link href="/meetings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="space-y-3 p-6 sm:p-0">
              <Skeleton className="h-14 w-full rounded-xl shimmer" />
              <Skeleton className="h-14 w-full rounded-xl shimmer" />
              <Skeleton className="h-14 w-full rounded-xl shimmer" />
            </div>
          ) : (
            <RecentMeetingsTable />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
