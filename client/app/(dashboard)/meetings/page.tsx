"use client";

import { RecentMeetingsTable } from "@/components/dashboard/recent-meetings-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMeetings } from "@/contexts/meeting-context";
import { API_BASE } from "@/lib/config";
import type { MeetingRecord, TranscriptHighlight } from "@/lib/types/meeting";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function MeetingsPage() {
  const { addMeeting, incrementStats } = useMeetings();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/api/upload`, formData);
      const data = res.data as {
        id: string;
        insights: MeetingRecord["insights"];
        highlights?: TranscriptHighlight[];
      };
      const record: MeetingRecord = {
        id: String(data.id),
        insights: data.insights,
        highlights: data.highlights ?? [],
        createdAt: new Date().toISOString(),
        status: "completed",
        durationMin: Math.round(file.size / (128 * 1024)) || undefined,
        serverSynced: true,
      };
      addMeeting(record);
      incrementStats(1, data.insights.summary?.length ?? 0);
      setFile(null);
      router.push(`/meetings/${encodeURIComponent(record.id)}`);
    } catch (e) {
      console.error(e);
      setError(
        "Upload failed. Ensure the API is running and the file format is supported."
      );
    } finally {
      setLoading(false);
    }
  }, [addMeeting, file, incrementStats, router]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Meetings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload recordings for AI analysis or open recent sessions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-primary" />
              Upload audio or video
            </CardTitle>
            <CardDescription>
              Sends to your backend at{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                {API_BASE}/api/upload
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-6 transition-colors hover:bg-muted/30">
              <Input
                type="file"
                accept="audio/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="cursor-pointer border-0 bg-transparent file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full rounded-xl sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload &amp; analyze
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick links</CardTitle>
            <CardDescription>Jump into recording or assistant.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1 rounded-xl">
              <Link href="/live">Live recorder</Link>
            </Button>
            <Button asChild variant="secondary" className="flex-1 rounded-xl">
              <Link href="/chat">Chat assistant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All meetings</CardTitle>
          <CardDescription>
            Sorted by most recently added or analyzed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentMeetingsTable showAll />
        </CardContent>
      </Card>
    </div>
  );
}
