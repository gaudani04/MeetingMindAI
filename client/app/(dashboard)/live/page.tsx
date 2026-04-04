"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE } from "@/lib/config";
import useAudioWebSocket from "@/hooks/useAudioWebSocket";
import axios from "axios";
import {
  HelpCircle,
  Loader2,
  MonitorPlay,
  Mic,
  Radio,
  Sparkles,
  Square,
} from "lucide-react";
import { useCallback, useState } from "react";

export default function LiveMeetingPage() {
  const {
    isRecording,
    transcript,
    summaries,
    lastQuestion,
    lastAnswerSuggestion,
    tabAudioEnabled,
    startRecording,
    stopRecording,
  } = useAudioWebSocket();
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleSuggest = useCallback(async () => {
    setSuggestLoading(true);
    setSuggestion(null);
    try {
      const res = await axios.post(`${API_BASE}/api/ask`, {
        transcript,
        question: "What should I answer?",
      });
      setSuggestion(String((res.data as { answer?: string }).answer ?? ""));
    } catch (e) {
      console.error(e);
      setSuggestion(
        "Could not reach the AI service. Is the API running at " +
          API_BASE +
          "?"
      );
    } finally {
      setSuggestLoading(false);
    }
  }, [transcript]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Capture
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-gradient">Live session</span>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Microphone plus optional{" "}
          <strong className="font-medium text-foreground/90">tab audio</strong>{" "}
          — perfect for Zoom, Google Meet, or YouTube. Pick your meeting tab and
          enable audio when prompted.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="relative overflow-hidden border-white/40 bg-white/70 shadow-soft-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
          <CardContent className="relative flex flex-col items-center gap-8 px-6 py-12 md:py-14">
            <div className="relative">
              {isRecording ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-500/25" />
              ) : null}
              <Button
                type="button"
                variant={isRecording ? "destructive" : "default"}
                size="icon-lg"
                className={`relative h-40 w-40 rounded-full shadow-glow transition-all duration-300 hover:scale-[1.04] active:scale-[0.96] ${
                  isRecording
                    ? ""
                    : "bg-gradient-to-br from-cyan-600 via-sky-500 to-blue-600 hover:shadow-soft-lg"
                }`}
                onClick={isRecording ? stopRecording : startRecording}
                aria-pressed={isRecording}
              >
                {isRecording ? (
                  <Square className="h-11 w-11 fill-current" />
                ) : (
                  <Mic className="h-14 w-14" />
                )}
              </Button>
            </div>
            <div className="space-y-2 text-center">
              <p className="font-display text-lg font-semibold">
                {isRecording ? "Recording" : "Ready when you are"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRecording
                  ? "Stop when the call ends — we keep streaming to the AI."
                  : "Starts mic capture, then asks which screen or tab to share."}
              </p>
              {isRecording ? (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium">
                    <Mic className="h-3.5 w-3.5" />
                    Mic on
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                      tabAudioEnabled
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                        : "border-border/80 bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <MonitorPlay className="h-3.5 w-3.5" />
                    {tabAudioEnabled
                      ? "Tab / system audio"
                      : "Tab audio not shared"}
                  </span>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-white/35 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-md dark:from-cyan-500/12">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <MonitorPlay className="h-4 w-4 text-primary" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex gap-2">
                <span className="font-semibold text-foreground">1.</span>
                Allow microphone access.
              </p>
              <p className="flex gap-2">
                <span className="font-semibold text-foreground">2.</span>
                Choose the window or tab playing your call or video.
              </p>
              <p className="flex gap-2">
                <span className="font-semibold text-foreground">3.</span>
                Check &quot;Share audio&quot; in the browser picker when
                available.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
            <CardContent className="flex gap-3 py-4 text-sm leading-relaxed text-muted-foreground">
              <Radio className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Audio is mixed and sent as a single stream to your transcription
              backend — same pipeline as file upload summaries.
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[340px] border-white/40 bg-white/65 backdrop-blur-xl dark:bg-slate-900/45 lg:min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-display text-lg">Live transcript</CardTitle>
            <CardDescription>
              Latest text from the model (replaced as segments finalize).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] lg:h-[300px]">
            <ScrollArea className="h-full rounded-xl border border-white/30 bg-muted/15 p-4 dark:border-white/10 dark:bg-slate-950/30">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {transcript || (
                  <span className="italic text-muted-foreground">
                    Transcript appears once you start — share your meeting tab
                    for best results.
                  </span>
                )}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="min-h-[340px] border-white/40 bg-white/65 backdrop-blur-xl dark:bg-slate-900/45 lg:min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-display text-lg">Live summary</CardTitle>
            <CardDescription>Rolling insight cards from your backend.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid max-h-[200px] gap-3 overflow-y-auto pr-1 lg:max-h-[220px]">
              {summaries.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-10 text-center">
                  <Sparkles className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm italic text-muted-foreground">
                    Insights appear as the session generates summaries…
                  </p>
                </div>
              ) : (
                summaries.map((s, i) => (
                  <div
                    key={`${i}-${s.slice(0, 12)}`}
                    className="animate-scale-in rounded-xl border border-white/40 bg-gradient-to-br from-card to-cyan-500/10 p-4 text-sm shadow-soft dark:border-white/10 dark:to-cyan-500/12"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Insight {i + 1}
                    </div>
                    <p className="leading-relaxed text-foreground">{s}</p>
                  </div>
                ))
              )}
            </div>

            {(lastQuestion || lastAnswerSuggestion) && (
              <div className="space-y-2 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-3 text-sm dark:bg-cyan-500/10">
                {lastQuestion ? (
                  <p>
                    <span className="font-semibold text-foreground">Q: </span>
                    <span className="text-muted-foreground">{lastQuestion}</span>
                  </p>
                ) : null}
                {lastAnswerSuggestion ? (
                  <p>
                    <span className="font-semibold text-foreground">
                      Suggested:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {lastAnswerSuggestion}
                    </span>
                  </p>
                ) : null}
              </div>
            )}

            <Button
              variant="secondary"
              className="w-full rounded-xl border border-border/80 bg-white/80 shadow-soft transition-all hover:scale-[1.01] dark:bg-slate-900/60"
              onClick={handleSuggest}
              disabled={suggestLoading || !transcript.trim()}
            >
              {suggestLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </>
              ) : (
                <>
                  <HelpCircle className="h-4 w-4" />
                  AI suggest answer
                </>
              )}
            </Button>
            {suggestion ? (
              <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-cyan-500/10 p-4 text-sm leading-relaxed">
                {suggestion}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
