import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint: ReactNode;
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <p className="text-body text-foreground-secondary">{label}</p>
      <p className="mt-3 text-heading text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}
