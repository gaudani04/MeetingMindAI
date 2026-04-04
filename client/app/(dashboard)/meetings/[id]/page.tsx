"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMeetings } from "@/contexts/meeting-context";
import {
  AlertTriangle,
  Check,
  Download,
  Gavel,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { TranscriptHighlight } from "@/lib/types/meeting";

function formatTimeRange(startSec: number, endSec: number) {
  const fmt = (t: number) => {
    const s = Math.max(0, t);
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, "0")}`;
  };
  return `${fmt(startSec)} – ${fmt(endSec)}`;
}

function highlightIcon(type: TranscriptHighlight["type"]) {
  switch (type) {
    case "decision":
      return Gavel;
    case "insight":
      return Lightbulb;
    default:
      return MessageSquare;
  }
}

export default function MeetingDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(String(params.id ?? ""));
  const { meetings } = useMeetings();
  const meeting = useMemo(
    () => meetings.find((m) => m.id === id),
    [meetings, id]
  );
  const [exported, setExported] = useState(false);

  const handleExport = useCallback(() => {
    if (!meeting) return;
    const lines: string[] = [
      `Meeting: ${meeting.insights.title}`,
      "",
      "Summary:",
      ...meeting.insights.summary.map((s) => `• ${s}`),
    ];
    const hl = meeting.highlights ?? [];
    if (hl.length > 0) {
      lines.push("", "Key moments:");
      for (const h of hl) {
        lines.push(
          `• [${formatTimeRange(h.start_sec, h.end_sec)}] (${h.type}) ${h.title}: ${h.summary}`
        );
      }
    }
    const text = [
      ...lines,
      "",
      "Action items:",
      ...meeting.insights.action_items.map(
        (a) => `• ${a.task} — ${a.owner} — ${a.deadline}`
      ),
      "",
      "Risks:",
      ...meeting.insights.risks.map((r) => `• ${r}`),
    ].join("\n");
    void navigator.clipboard.writeText(text);
    setExported(true);
    window.setTimeout(() => setExported(false), 2500);
  }, [meeting]);

  if (!meeting) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meeting not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This meeting may not be loaded yet. Return to meetings and open one
            from the table.
          </p>
          <Button asChild>
            <Link href="/meetings">Back to meetings</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              {meeting.insights.title}
            </h1>
            <Badge variant="secondary">ID: {meeting.id}</Badge>
          </div>
          <div className="mt-3 h-0.5 w-14 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 opacity-90 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-500" />
          <p className="mt-3 text-sm text-muted-foreground">
            Summary, timestamped key moments, action items, and risks.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-xl shadow-soft transition-all hover:shadow-soft-lg"
          onClick={handleExport}
        >
          {exported ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" />
              Copied
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground marker:text-primary">
            {meeting.insights.summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent dark:from-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">Key moments</CardTitle>
          <p className="text-sm font-normal text-muted-foreground">
            Decisions, important discussions, and insights tied to timestamps in
            the recording.
          </p>
        </CardHeader>
        <CardContent>
          {(meeting.highlights ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No key moments were extracted for this meeting.
            </p>
          ) : (
            <ul className="space-y-4">
              {(meeting.highlights ?? []).map((h, i) => {
                const Icon = highlightIcon(h.type);
                return (
                  <li
                    key={`${h.start_sec}-${h.end_sec}-${i}`}
                    className="rounded-xl border border-border/80 bg-card/80 p-4 shadow-soft transition-shadow hover:shadow-soft-lg"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {formatTimeRange(h.start_sec, h.end_sec)}
                          </Badge>
                          <Badge
                            variant={
                              h.type === "decision"
                                ? "default"
                                : h.type === "insight"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="capitalize"
                          >
                            {h.type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold leading-snug text-foreground">
                          {h.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {h.summary}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Action items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Deadline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meeting.insights.action_items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No action items extracted.
                  </TableCell>
                </TableRow>
              ) : (
                meeting.insights.action_items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.task}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.owner}</Badge>
                    </TableCell>
                    <TableCell>{item.deadline}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-gradient-to-br from-destructive/5 to-transparent dark:from-destructive/10">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <div className="rounded-lg bg-destructive/15 p-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <CardTitle className="text-lg">Risks &amp; concerns</CardTitle>
        </CardHeader>
        <CardContent>
          {meeting.insights.risks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No major risks flagged for this meeting.
            </p>
          ) : (
            <ul className="space-y-2 text-sm leading-relaxed text-destructive dark:text-red-300">
              {meeting.insights.risks.map((r, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-destructive/20 bg-background/60 px-3 py-2"
                >
                  {r}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
