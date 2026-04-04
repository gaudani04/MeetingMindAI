import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  gradient?: boolean;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  gradient,
  className,
}: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          {gradient ? <span className="text-gradient">{title}</span> : title}
        </h1>
        <div className="h-0.5 w-14 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 opacity-90 dark:from-cyan-400 dark:via-sky-400 dark:to-blue-500" />
        {description ? (
          <p className="max-w-2xl pt-1 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
