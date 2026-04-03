"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMeetings } from "@/contexts/meeting-context";
import { API_BASE } from "@/lib/config";
import type { ChatMessage } from "@/lib/types/meeting";
import axios, { isAxiosError } from "axios";
import { Bot, Loader2, Send, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function ChatAssistantPage() {
  const {
    meetings,
    lastChatMeetingId,
    setLastChatMeetingId,
  } = useMeetings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chatMeetings = useMemo(
    () => meetings.filter((m) => m.serverSynced === true),
    [meetings]
  );

  useEffect(() => {
    if (
      !lastChatMeetingId ||
      !chatMeetings.some((m) => m.id === lastChatMeetingId)
    ) {
      setLastChatMeetingId(chatMeetings[0]?.id ?? null);
    }
  }, [chatMeetings, lastChatMeetingId, setLastChatMeetingId]);

  const meetingId = lastChatMeetingId ?? "";
  const meeting = useMemo(
    () => meetings.find((m) => m.id === meetingId),
    [meetings, meetingId]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || !meetingId) return;
    setInput("");
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        meeting_id: meetingId,
        question: q,
      });
      const answer = String((res.data as { answer?: string }).answer ?? "");
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", text: answer },
      ]);
    } catch (e) {
      console.error(e);
      let fallback =
        "Could not reach the chat API. Confirm the server is running at " +
        API_BASE +
        ".";
      if (isAxiosError(e) && e.response?.status === 404) {
        fallback =
          "No meeting with this ID was found on the server (404). Chat only works for meetings you uploaded and analyzed on the Meetings page so they are stored in the database.";
      } else if (isAxiosError(e) && e.response?.data) {
        const detail = (e.response.data as { detail?: string }).detail;
        if (typeof detail === "string") {
          fallback = detail;
        }
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: fallback,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, meetingId]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Chat assistant
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ask questions in a ChatGPT-style thread. Context uses the selected
          meeting id for your backend.
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card/50 p-4 shadow-soft md:flex-row md:items-center md:justify-between">
        <label className="text-sm font-medium text-muted-foreground md:shrink-0">
          Meeting context
        </label>
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:max-w-xs"
          value={meetingId || ""}
          onChange={(e) => setLastChatMeetingId(e.target.value || null)}
          disabled={chatMeetings.length === 0}
        >
          {chatMeetings.length === 0 ? (
            <option value="">
              Upload a meeting first (demo rows are UI-only)
            </option>
          ) : (
            chatMeetings.map((m) => (
              <option key={m.id} value={m.id}>
                {m.insights.title} ({m.id})
              </option>
            ))
          )}
        </select>
        {meeting ? (
          <Button variant="link" asChild className="md:ml-auto">
            <Link href={`/meetings/${encodeURIComponent(meeting.id)}`}>
              View meeting
            </Link>
          </Button>
        ) : null}
      </div>

      {chatMeetings.length === 0 ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          The dashboard includes sample meetings for the UI; they are not in
          your API database.{" "}
          <Link href="/meetings" className="font-medium underline underline-offset-2">
            Upload and analyze a file
          </Link>{" "}
          to enable chat for that meeting&apos;s ID.
        </p>
      ) : null}

      <Card className="flex flex-1 flex-col overflow-hidden border-border/80 shadow-soft-lg">
        <ScrollArea className="h-[min(60vh,560px)] p-4">
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Start by asking anything about this meeting&apos;s notes.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-soft ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft transition-all ${
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted/80"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Assistant is typing…
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
        <div className="border-t border-border/80 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                meetingId
                  ? "Message Smart Meeting Notes AI…"
                  : "Upload a meeting on the Meetings page…"
              }
              disabled={!meetingId || chatMeetings.length === 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              className="rounded-xl border-border/80 bg-background/80"
            />
            <Button
              className="rounded-xl px-4"
              onClick={() => void send()}
              disabled={
                !meetingId ||
                chatMeetings.length === 0 ||
                loading ||
                !input.trim()
              }
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
