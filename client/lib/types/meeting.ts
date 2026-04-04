export type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

export type TranscriptHighlightType = "decision" | "discussion" | "insight";

export type TranscriptHighlight = {
  type: TranscriptHighlightType;
  /** Start time in seconds (from transcription segments). */
  start_sec: number;
  /** End time in seconds (inclusive range from segments). */
  end_sec: number;
  title: string;
  summary: string;
};

export type MeetingInsights = {
  title: string;
  summary: string[];
  action_items: ActionItem[];
  risks: string[];
};

export type MeetingRecord = {
  id: string;
  insights: MeetingInsights;
  /** AI-detected key moments with timestamps from the recording. */
  highlights?: TranscriptHighlight[];
  createdAt: string;
  durationMin?: number;
  status?: "completed" | "processing" | "live";
  /** True when this id exists in the API database (e.g. after upload). Chat requires this. */
  serverSynced?: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};
