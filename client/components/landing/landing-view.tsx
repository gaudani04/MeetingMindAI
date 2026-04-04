import { AppShellBackground } from "@/components/layout/app-shell-background";
import { LandingNav } from "@/components/landing/landing-nav";
import {
  ArrowRight,
  Boxes,
  Brain,
  Cpu,
  MessageSquare,
  Mic,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Live capture",
    desc: "Browser + mic routing with low-latency transcription pipelines built for real rooms.",
    icon: Mic,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Model-ready summaries",
    desc: "Structured insights, risks, and actions — not a wall of text.",
    icon: Brain,
    className: "md:col-span-1",
  },
  {
    title: "Chat on corpus",
    desc: "Ask across meetings with grounded answers tied to your notes.",
    icon: MessageSquare,
    className: "md:col-span-1",
  },
  {
    title: "Enterprise posture",
    desc: "Separation-friendly workflows and clear audit trails for serious teams.",
    icon: Shield,
    className: "md:col-span-2",
  },
  {
    title: "Streaming stack",
    desc: "Socket-backed updates and resilient uploads for messy real-world networks.",
    icon: Zap,
    className: "md:col-span-1",
  },
  {
    title: "Composable UI",
    desc: "Glass, dense data surfaces, and keyboard-friendly navigation by default.",
    icon: Boxes,
    className: "md:col-span-1",
  },
];

function FloatingShapes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Metallic / glass prisms */}
      <div
        className="absolute -left-[8%] top-[18%] h-40 w-40 motion-safe:animate-float rounded-3xl border border-white/20 bg-gradient-to-br from-slate-400/30 via-slate-600/20 to-transparent opacity-80 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_25px_60px_-20px_rgba(0,0,0,0.65)] backdrop-blur-sm dark:from-slate-300/20 dark:via-slate-500/15 md:h-52 md:w-52"
        style={{
          transform: "perspective(900px) rotateX(18deg) rotateY(-22deg)",
        }}
      />
      <div
        className="absolute right-[-5%] top-[10%] h-36 w-36 motion-safe:animate-float rounded-full border border-cyan-400/25 bg-gradient-to-br from-cyan-400/25 via-blue-500/10 to-transparent opacity-90 shadow-[0_0_60px_-15px_rgba(34,211,238,0.45)] backdrop-blur-md md:h-44 md:w-44"
        style={{
          animationDelay: "1.2s",
          transform: "perspective(800px) rotateY(35deg)",
        }}
      />
      <div
        className="absolute bottom-[12%] left-[8%] h-28 w-48 motion-safe:animate-float rounded-2xl border border-white/15 bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent opacity-75 shadow-2xl backdrop-blur-md md:h-36 md:w-56"
        style={{
          animationDelay: "0.6s",
          transform: "perspective(1000px) rotateX(-12deg) rotateZ(8deg)",
        }}
      />
      <div
        className="absolute bottom-[20%] right-[12%] h-24 w-24 motion-safe:animate-float rounded-lg border border-white/25 bg-gradient-to-br from-white/40 to-white/5 opacity-70 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md dark:from-white/15 dark:to-white/[0.02]"
        style={{
          animationDelay: "1.8s",
          transform: "perspective(700px) rotateX(20deg) rotateY(45deg)",
        }}
      />
      <div className="absolute left-1/2 top-1/3 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent dark:via-cyan-400/35" />
    </div>
  );
}

export function LandingView() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#f0f2f5] via-[#e8eaef] to-[#dfe3e9] text-slate-900 dark:from-[#060708] dark:via-[#0a0c10] dark:to-[#050608] dark:text-white"
    >
      <AppShellBackground />

      <div className="relative z-10 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]">
        <LandingNav />

        <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 md:px-6 md:pt-32">
          {/* Hero */}
          <section className="relative mb-24 md:mb-32">
            <FloatingShapes />
            <div className="relative mx-auto max-w-4xl text-center">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-500/10 dark:text-cyan-300">
                <Cpu className="h-3.5 w-3.5" />
                Engineering-grade meeting intelligence
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 dark:text-white md:text-6xl lg:text-[3.5rem]">
                Ship clarity from{" "}
                <span className="bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 bg-clip-text text-transparent dark:from-cyan-300 dark:via-sky-300 dark:to-blue-400">
                  every conversation
                </span>
                .
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
                Live transcription, structured AI summaries, and grounded chat —
                one calm control plane for teams that care about precision.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl px-10 text-base font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_4px_24px_-4px_rgba(34,211,238,0.45),0_0_48px_-12px_rgba(59,130,246,0.35)] transition-transform duration-300 motion-safe:hover:scale-[1.02] active:scale-[0.98] dark:text-slate-950"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/90 via-cyan-100/90 to-sky-100/90 dark:from-white/95 dark:via-cyan-50/95 dark:to-sky-100/95" />
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-transparent to-blue-500/25 opacity-80" />
                  <span className="relative flex items-center gap-2">
                    Request a trial
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 underline-offset-4 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Sign in to workspace
                </Link>
              </div>
            </div>
          </section>

          {/* Bento */}
          <section className="relative">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                  Built like infrastructure
                </h2>
                <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
                  Dense, high-signal surfaces — the same discipline you expect in
                  a serious developer platform.
                </p>
              </div>
              <div className="h-px w-full max-w-xs bg-gradient-to-r from-cyan-500 to-blue-500 opacity-80 md:mb-2 dark:from-cyan-400 dark:to-blue-500" />
            </div>

            <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-6 shadow-soft backdrop-blur-md transition-shadow duration-300 hover:shadow-soft-lg dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-none dark:hover:border-cyan-400/20 ${f.className}`}
                >
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 opacity-90 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-500" />
                  <div className="pl-4">
                    <div className="mb-4 inline-flex rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-cyan-200">
                      <f.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {f.desc}
                    </p>
                  </div>
                  <Sparkles className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 text-cyan-400/10 transition-transform duration-500 group-hover:rotate-12 dark:text-cyan-400/15" />
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-24 border-t border-slate-200/80 pt-10 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-500">
            <p className="font-display font-medium text-slate-700 dark:text-slate-400">
              MeetingMindAI — intelligence for every meeting.
            </p>
            <p className="mt-2">
              <Link
                href="/login"
                className="text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
              >
                Workspace sign-in
              </Link>
              <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
              <Link
                href="/signup"
                className="text-cyan-600 underline-offset-4 hover:underline dark:text-cyan-400"
              >
                Create account
              </Link>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
