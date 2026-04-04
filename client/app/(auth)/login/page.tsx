"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    login(email.trim());
    router.push("/");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500 ease-out motion-reduce:animate-none">
      <div className="glass-panel rounded-2xl p-8 shadow-soft-lg ring-1 ring-white/40 transition-shadow duration-300 dark:ring-white/10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-600 via-sky-500 to-blue-600 text-white shadow-glow transition-transform duration-300 hover:scale-105">
            <MessageSquare className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to Smart Meeting Notes AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground/90"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-border/80 bg-white/80 shadow-inner transition-all focus-visible:ring-primary/40 dark:bg-slate-950/40"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground/90"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-border/80 bg-white/80 shadow-inner transition-all focus-visible:ring-primary/40 dark:bg-slate-950/40"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="group h-11 w-full rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 text-base font-semibold text-white shadow-glow transition-all hover:scale-[1.01] hover:shadow-soft-lg active:scale-[0.99]"
          >
            {loading ? "Signing in…" : "Sign in"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          >
            Create one
          </Link>
          <span className="mx-2 text-muted-foreground/50">·</span>
          <Link
            href="/landing"
            className="font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Product overview
          </Link>
        </p>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground/80">
        By continuing you agree to our terms and privacy policy.
      </p>
    </div>
  );
}
