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
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Overview
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="max-w-lg text-base text-muted-foreground">
            Your workspace at a glance — meetings, transcripts, and AI
            insights in one calm surface.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="h-12 rounded-full bg-gradient-to-r from-primary to-violet-600 px-8 font-semibold shadow-glow transition-all hover:scale-[1.02] hover:shadow-soft-lg active:scale-[0.98]"
        >
          <Link href="/live">
            <Mic className="h-4 w-4" />
            Start live session
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          <Skeleton className="h-40 rounded-2xl shimmer" />
          <Skeleton className="h-40 rounded-2xl shimmer" />
          <Skeleton className="h-40 rounded-2xl shimmer" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Total meetings"
            value={meetings.length}
            hint="Across your workspace"
            icon={Video}
            gradient
          />
          <StatCard
            title="Transcriptions"
            value={totalTranscriptions.toLocaleString()}
            hint="Uploads + live sessions"
            icon={Sparkles}
          />
          <StatCard
            title="AI insights"
            value={aiInsightsCount.toLocaleString()}
            hint="Summaries & key points"
            icon={Brain}
          />
        </div>
      )}

      <Card className="border-white/40 bg-white/70 shadow-soft-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/45">
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
