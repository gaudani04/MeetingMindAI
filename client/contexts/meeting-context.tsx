"use client";

import type { MeetingRecord } from "@/lib/types/meeting";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type MeetingContextValue = {
  meetings: MeetingRecord[];
  addMeeting: (meeting: MeetingRecord) => void;
  updateMeeting: (id: string, patch: Partial<MeetingRecord>) => void;
  lastChatMeetingId: string | null;
  setLastChatMeetingId: (id: string | null) => void;
  totalTranscriptions: number;
  aiInsightsCount: number;
  incrementStats: (transcriptions?: number, insights?: number) => void;
};

const MeetingContext = createContext<MeetingContextValue | null>(null);

const seedMeetings: MeetingRecord[] = [
  {
    id: "demo-1",
    serverSynced: false,
    createdAt: "2026-03-28T14:00:00.000Z",
    durationMin: 42,
    status: "completed",
    insights: {
      title: "Q1 Product Sync",
      summary: [
        "Aligned on roadmap for Smart Meeting Notes rollout.",
        "Decided to prioritize live transcription accuracy in April.",
      ],
      action_items: [
        { task: "Ship beta to design partners", owner: "Alex", deadline: "Apr 8" },
        { task: "Review security checklist", owner: "Sam", deadline: "Apr 5" },
      ],
      risks: [
        "API rate limits on peak demo days may need caching.",
      ],
    },
    highlights: [
      {
        type: "decision",
        start_sec: 120,
        end_sec: 195,
        title: "April focus: transcription accuracy",
        summary:
          "The team agreed to prioritize improving live transcription before expanding other features.",
      },
      {
        type: "discussion",
        start_sec: 300,
        end_sec: 420,
        title: "Design partner beta scope",
        summary:
          "Discussed which workflows to include in the first beta and how feedback will be collected.",
      },
      {
        type: "insight",
        start_sec: 540,
        end_sec: 600,
        title: "Rate limits on demo days",
        summary:
          "Noted that traffic spikes during demos could hit API limits without caching.",
      },
    ],
  },
  {
    id: "demo-2",
    serverSynced: false,
    createdAt: "2026-03-30T10:30:00.000Z",
    durationMin: 58,
    status: "completed",
    insights: {
      title: "Customer Research Debrief",
      summary: [
        "Users want clearer action item ownership after calls.",
        "Chat assistant ranked highest for post-meeting workflow.",
      ],
      action_items: [
        { task: "Update action-items table UX", owner: "Jordan", deadline: "Apr 12" },
      ],
      risks: [],
    },
  },
];

export function MeetingProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<MeetingRecord[]>(seedMeetings);
  const [lastChatMeetingId, setLastChatMeetingId] = useState<string | null>(
    null
  );
  const [totalTranscriptions, setTotalTranscriptions] = useState(156);
  const [aiInsightsCount, setAiInsightsCount] = useState(432);

  const addMeeting = useCallback((meeting: MeetingRecord) => {
    setMeetings((prev) => [meeting, ...prev]);
    setLastChatMeetingId(meeting.id);
    setTotalTranscriptions((t) => t + 1);
    setAiInsightsCount((n) => n + (meeting.insights.summary?.length ?? 0));
  }, []);

  const updateMeeting = useCallback((id: string, patch: Partial<MeetingRecord>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }, []);

  const incrementStats = useCallback((transcriptions = 0, insights = 0) => {
    setTotalTranscriptions((t) => t + transcriptions);
    setAiInsightsCount((n) => n + insights);
  }, []);

  const value = useMemo(
    () => ({
      meetings,
      addMeeting,
      updateMeeting,
      lastChatMeetingId,
      setLastChatMeetingId,
      totalTranscriptions,
      aiInsightsCount,
      incrementStats,
    }),
    [
      meetings,
      addMeeting,
      updateMeeting,
      lastChatMeetingId,
      totalTranscriptions,
      aiInsightsCount,
      incrementStats,
    ]
  );

  return (
    <MeetingContext.Provider value={value}>{children}</MeetingContext.Provider>
  );
}

export function useMeetings() {
  const ctx = useContext(MeetingContext);
  if (!ctx) {
    throw new Error("useMeetings must be used within MeetingProvider");
  }
  return ctx;
}
