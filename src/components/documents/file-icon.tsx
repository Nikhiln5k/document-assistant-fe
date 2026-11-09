import { File, FileImage, FileSpreadsheet, FileText, FileType, type LucideIcon } from "lucide-react";
import type { DocumentFileType } from "@/types/document";
import { cn } from "@/lib/utils";

// Icon, colour and readable label for each file type the backend supports.
export const FILE_TYPES: Record<DocumentFileType, { label: string; icon: LucideIcon; className: string }> = {
  pdf: { label: "PDF", icon: FileText, className: "bg-red-500/10 text-red-500" },
  excel: { label: "Excel", icon: FileSpreadsheet, className: "bg-green-500/10 text-green-500" },
  word: { label: "Word", icon: FileType, className: "bg-blue-500/10 text-blue-500" },
  image: { label: "Image", icon: FileImage, className: "bg-surface-raised text-accent" },
  text: { label: "Text", icon: File, className: "bg-amber-500/10 text-amber-500" },
};

export function FileIcon({ type }: { type: DocumentFileType }) {
  const { icon: Icon, className } = FILE_TYPES[type] ?? FILE_TYPES.text;

  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", className)}>
      <Icon size={20} />
    </span>
  );
}
