"use client"; // Needed for drag-and-drop state and the file picker

import { useRef, useState, type DragEvent } from "react";
import { CloudUpload, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ".pdf,.xls,.xlsx,.png,.jpg,.jpeg,.webp";

export function UploadZone() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    // TODO: send the files to the upload API
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <section id="upload" className="rounded-card border border-border bg-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">Upload documents</h3>
          <p className="mt-1 text-caption text-muted">PDF, Excel, PNG, JPG and other supported images</p>
        </div>
        <CloudUpload size={20} className="text-muted" />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center rounded-card border border-dashed px-4 py-10 text-center transition",
          isDragging ? "border-primary bg-surface-raised" : "border-border-accent"
        )}
      >
        <Upload size={24} className="text-foreground-secondary" />
        <p className="mt-3 font-semibold text-foreground">Drag and drop your files here</p>
        <p className="mt-1 text-caption text-muted">or choose files from your computer</p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 rounded-control bg-linear-to-r from-primary to-primary-to px-5 py-2.5 font-semibold text-primary-foreground shadow-primary transition hover:from-primary-hover hover:to-primary-to-hover"
        >
          Browse files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <p className="mt-4 text-xs text-muted">Maximum file size: 20 MB per file</p>
      </div>
    </section>
  );
}
