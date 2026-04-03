"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { API_BASE, WS_TRANSCRIBE } from "@/lib/config";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Appearance and connection details for your workspace.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Appearance</CardTitle>
            <CardDescription>
              Light, dark, or follow system preferences.
            </CardDescription>
          </div>
          <ThemeToggle />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API &amp; realtime</CardTitle>
          <CardDescription>
            Values come from{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_API_URL
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_WS_TRANSCRIBE_URL
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium">REST base</p>
            <p className="mt-1 rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs">
              {API_BASE}
            </p>
          </div>
          <Separator />
          <div>
            <p className="font-medium">WebSocket (transcription)</p>
            <p className="mt-1 rounded-lg bg-muted/50 px-3 py-2 font-mono text-xs break-all">
              {WS_TRANSCRIBE}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
