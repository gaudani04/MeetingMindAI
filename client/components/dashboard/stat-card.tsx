import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
  gradient?: boolean;
};

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  loading,
  className,
  gradient,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden border-l-[3px] border-l-cyan-500/45 border-white/40 bg-white/75 shadow-soft-lg backdrop-blur-md transition-all duration-300 ease-out motion-safe:hover:-translate-y-0.5 hover:shadow-glow hover:ring-1 hover:ring-cyan-500/20 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:ring-cyan-400/25",
        gradient &&
          "border-primary/25 bg-gradient-to-br from-white/92 via-white/72 to-cyan-500/[0.1] dark:from-slate-900/85 dark:via-slate-900/65 dark:to-cyan-950/25",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-600/15 p-2.5 text-primary shadow-inner transition-transform duration-300 ease-out group-hover:scale-110 dark:from-cyan-400/20 dark:to-blue-600/20">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-28 rounded-lg shimmer" />
            <Skeleton className="h-3 w-36 rounded-md shimmer" />
          </div>
        ) : (
          <>
            <p className="font-display text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {hint ? (
              <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}
