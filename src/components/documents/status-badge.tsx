import type { DocumentStatus } from "@/types/document";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<DocumentStatus, { label: string; className: string }> = {
  processed: { label: "Ready", className: "bg-success/10 text-success" },
  processing: { label: "Processing", className: "bg-warning/10 text-warning" },
  failed: { label: "Failed", className: "bg-danger/10 text-danger" },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", className)}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "processing" && "animate-pulse")} />
      {label}
    </span>
  );
}
