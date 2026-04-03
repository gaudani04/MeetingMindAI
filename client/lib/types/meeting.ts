export type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
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
