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
        "group overflow-hidden border-white/40 bg-white/75 shadow-soft-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-slate-900/50",
        gradient &&
          "border-primary/25 bg-gradient-to-br from-white/90 via-white/70 to-violet-500/10 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-violet-500/15",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="rounded-xl bg-gradient-to-br from-primary/15 to-violet-500/15 p-2.5 text-primary shadow-inner transition-transform duration-300 group-hover:scale-110 dark:from-primary/25 dark:to-violet-500/20">
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
