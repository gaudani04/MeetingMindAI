"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMeetings } from "@/contexts/meeting-context";
import type { MeetingRecord } from "@/lib/types/meeting";
import { ExternalLink, Inbox } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusBadge(status: MeetingRecord["status"]) {
  switch (status) {
    case "live":
      return <Badge variant="live">Live</Badge>;
    case "processing":
      return <Badge variant="warning">Processing</Badge>;
    default:
      return <Badge variant="success">Completed</Badge>;
  }
}

type RecentMeetingsTableProps = {
  showAll?: boolean;
  maxRows?: number;
};

export function RecentMeetingsTable({
  showAll,
  maxRows = 8,
}: RecentMeetingsTableProps) {
  const { meetings } = useMeetings();
  const rows = showAll ? meetings : meetings.slice(0, maxRows);

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary">
          <Inbox className="h-7 w-7 opacity-80" />
        </div>
        <p className="font-display text-lg font-semibold text-foreground">
          No meetings yet
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Upload a recording or start a live session — your timeline will show
          up here with rich summaries and actions.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/meetings">Upload a meeting</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead className="hidden md:table-cell">Duration</TableHead>
          <TableHead className="hidden lg:table-cell">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((m) => (
          <TableRow
            key={m.id}
            className="transition-colors duration-200 hover:bg-primary/[0.04]"
          >
            <TableCell className="font-medium">{m.insights.title}</TableCell>
            <TableCell className="hidden sm:table-cell text-muted-foreground">
              {formatDate(m.createdAt)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {m.durationMin != null ? `${m.durationMin} min` : "—"}
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {statusBadge(m.status ?? "completed")}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/meetings/${m.id}`}>
                  Open
                  <ExternalLink className="ml-1 h-3.5 w-3.5 opacity-70" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
