import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MeetingMindAI — Intelligence for every meeting",
  description:
    "Live transcription, AI summaries, and grounded chat — a premium workspace for serious teams.",
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return children;
}
