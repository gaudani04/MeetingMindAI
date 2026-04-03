import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-page-gradient">
      <div
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/25 blur-3xl dark:bg-primary/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/15"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
