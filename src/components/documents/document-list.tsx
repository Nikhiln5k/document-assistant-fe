"use client"; // Needs state for search, filters, upload and polling

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleAlert, FileText, Loader2, Plus, Search, Trash2 } from "lucide-react";
import type { DocumentFileType, DocumentItem } from "@/types/document";
import { deleteDocument, getDocuments, uploadDocument } from "@/services/document.service";
import { ROUTES } from "@/constants/routes";
import { formatDate, formatFileSize } from "@/lib/utils";
import { FILE_TYPES, FileIcon } from "./file-icon";
import { StatusBadge } from "./status-badge";

const ACCEPTED_TYPES = ".pdf,.xlsx,.csv,.docx,.png,.jpg,.jpeg,.webp,.txt,.md";
const MAX_FILE_SIZE = 20 * 1024 * 1024; // Same 20 MB limit as the backend
const POLL_INTERVAL = 4000; // Re-check processing documents every 4 seconds

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function DocumentList() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DocumentFileType | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  // Bumping this number reloads the list.
  const [refreshKey, setRefreshKey] = useState(0);

  // Load documents whenever the search, filter or refreshKey changes.
  useEffect(() => {
    // Small delay so we don't call the API on every key press.
    const timer = setTimeout(async () => {
      try {
        const data = await getDocuments({
          search: search.trim() || undefined,
          type: type || undefined,
        });
        setDocuments(data);
        setError("");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, type, refreshKey]);

  // While any document is still processing, keep refreshing until it's done.
  const hasProcessing = documents.some((doc) => doc.status === "processing");
  useEffect(() => {
    if (!hasProcessing) return;
    const interval = setInterval(() => setRefreshKey((key) => key + 1), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [hasProcessing]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsUploading(true);
    setError("");
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} is larger than 20 MB.`);
        continue;
      }
      try {
        await uploadDocument(file);
      } catch (err) {
        setError(`${file.name}: ${getErrorMessage(err)}`);
      }
    }
    setIsUploading(false);
    setRefreshKey((key) => key + 1);

    // Clear the input so picking the same file again still triggers onChange.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (doc: DocumentItem) => {
    if (!window.confirm(`Delete "${doc.fileName}"? This cannot be undone.`)) return;

    try {
      await deleteDocument(doc.id);
      setDocuments((current) => current.filter((item) => item.id !== doc.id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const isFiltered = search.trim() !== "" || type !== "";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      {/* Page title and upload button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-heading text-foreground">My documents</h2>
          <p className="mt-1 text-body text-muted">Manage and explore your uploaded files.</p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-control bg-linear-to-r from-primary to-primary-to px-5 py-3 font-semibold text-primary-foreground shadow-primary transition hover:from-primary-hover hover:to-primary-to-hover disabled:opacity-60"
        >
          {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          {isUploading ? "Uploading..." : "Upload document"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Search and type filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="h-control w-full rounded-control border border-border bg-input pr-4 pl-11 text-body text-foreground outline-none transition placeholder:text-placeholder focus:border-ring"
          />
        </div>

        <div className="relative sm:w-48">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as DocumentFileType | "")}
            className="h-control w-full appearance-none rounded-control border border-border bg-input pr-10 pl-4 text-body text-foreground outline-none transition focus:border-ring"
          >
            <option value="">All types</option>
            {Object.entries(FILE_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 rounded-control border border-danger/30 bg-danger/10 px-4 py-3 text-body text-danger">
          <CircleAlert size={18} />
          {error}
        </p>
      )}

      {/* Documents table */}
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <div className="grid grid-cols-[1fr_auto_2.5rem] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted sm:grid-cols-[1fr_6rem_8rem_2.5rem]">
          <span>Document</span>
          <span className="hidden sm:block">Size</span>
          <span>Status</span>
          <span />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-16 text-body text-muted">
            <Loader2 size={18} className="animate-spin" />
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-raised text-accent">
              <FileText size={22} />
            </span>
            <p className="mt-4 font-semibold text-foreground">
              {isFiltered ? "No matching documents" : "No documents yet"}
            </p>
            <p className="mt-1 text-caption text-muted">
              {isFiltered
                ? "Try a different search or file type."
                : "Upload a PDF, Excel, Word, image or text file to get started."}
            </p>
          </div>
        ) : (
          <ul>
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="relative grid grid-cols-[1fr_auto_2.5rem] items-center gap-4 border-b border-border px-5 py-4 transition last:border-b-0 hover:bg-surface-raised sm:grid-cols-[1fr_6rem_8rem_2.5rem]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <FileIcon type={doc.fileType} />
                  <div className="min-w-0">
                    {/* The ::after overlay makes the whole row clickable */}
                    <Link
                      href={`${ROUTES.DOCUMENTS}/${doc.id}`}
                      className="block truncate font-semibold text-foreground after:absolute after:inset-0"
                      title={doc.fileName}
                    >
                      {doc.fileName}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {FILE_TYPES[doc.fileType]?.label} · {formatFileSize(doc.fileSize)} · {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>

                <span className="hidden text-body text-foreground-secondary sm:block">
                  {formatFileSize(doc.fileSize)}
                </span>

                <span title={doc.errorMessage ?? undefined}>
                  <StatusBadge status={doc.status} />
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(doc)}
                  aria-label={`Delete ${doc.fileName}`}
                  className="relative z-10 flex size-9 items-center justify-center rounded-control text-muted transition hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
