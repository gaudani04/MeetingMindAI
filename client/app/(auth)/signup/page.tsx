"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    login(email.trim());
    try {
      if (name.trim()) localStorage.setItem("sma-name", name.trim());
    } catch {
      /* ignore */
    }
    router.push("/");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="w-full max-w-[420px] animate-fade-in">
      <div className="glass-panel rounded-2xl p-8 shadow-soft-lg ring-1 ring-white/40 dark:ring-white/10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-primary to-sky-500 text-white shadow-glow transition-transform duration-300 hover:scale-105">
            <Sparkles className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Create your workspace
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start capturing meetings in minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground/90">
              Full name
            </label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 border-border/80 bg-white/80 shadow-inner transition-all focus-visible:ring-primary/40 dark:bg-slate-950/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground/90">
              Work email
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
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-border/80 bg-white/80 shadow-inner transition-all focus-visible:ring-primary/40 dark:bg-slate-950/40"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="group h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-primary text-base font-semibold shadow-glow transition-all hover:scale-[1.01] hover:shadow-soft-lg active:scale-[0.99]"
          >
            {loading ? "Creating account…" : "Get started"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
