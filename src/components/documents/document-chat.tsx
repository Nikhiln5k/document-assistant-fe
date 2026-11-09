"use client"; // Needs state for the conversation and the message input

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, CircleAlert, Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import type { ChatMessage, DocumentItem } from "@/types/document";
import {
  clearChatMessages,
  getChatMessages,
  getDocument,
  getDocuments,
  sendChatMessage,
} from "@/services/document.service";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

const POLL_INTERVAL = 4000; // Re-check a processing document every 4 seconds

// Quick questions shown above the input.
const SUGGESTIONS = [
  { label: "Key points", question: "What are the key points of this document?" },
  { label: "Important figures", question: "List the important figures and numbers in this document." },
  { label: "Conclusions", question: "What are the main conclusions of this document?" },
];

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function DocumentChat({ documentId }: { documentId: string }) {
  const router = useRouter();
  const messagesRef = useRef<HTMLDivElement>(null);

  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");

  // Load the document, its chat history and the list for the document picker.
  useEffect(() => {
    const load = async () => {
      try {
        const [doc, history, allDocs] = await Promise.all([
          getDocument(documentId),
          getChatMessages(documentId),
          getDocuments(),
        ]);
        setDocument(doc);
        setMessages(history);
        setDocuments(allDocs);
      } catch (err) {
        setLoadError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [documentId]);

  // While the document is still processing, check again until it's ready.
  const status = document?.status;
  useEffect(() => {
    if (status !== "processing") return;
    const interval = setInterval(async () => {
      try {
        setDocument(await getDocument(documentId));
      } catch {
        // Ignore and try again on the next tick.
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [status, documentId]);

  // Keep the newest message in view.
  useEffect(() => {
    const box = messagesRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, isSending]);

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || isSending) return;

    // Show the question straight away, then swap it for the saved one.
    const tempMessage: ChatMessage = {
      id: "pending-question", // Only one question is sent at a time
      documentId,
      role: "user",
      message: question,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, tempMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const { question: saved, answer } = await sendChatMessage(documentId, question);
      setMessages((current) => [...current.filter((m) => m.id !== tempMessage.id), saved, answer]);
    } catch (err) {
      // Put the question back in the input so the user can retry.
      setMessages((current) => current.filter((m) => m.id !== tempMessage.id));
      setInput(question);
      setError(getErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleClear = async () => {
    if (!messages.length || !window.confirm("Clear this conversation?")) return;

    try {
      await clearChatMessages(documentId);
      setMessages([]);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-16 text-body text-muted">
        <Loader2 size={18} className="animate-spin" />
        Loading document...
      </div>
    );
  }

  if (loadError || !document) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 p-16 text-center">
        <CircleAlert size={28} className="text-danger" />
        <p className="font-semibold text-foreground">{loadError || "Document not found"}</p>
        <Link href={ROUTES.DOCUMENTS} className="text-body text-accent hover:text-accent-hover">
          Back to my documents
        </Link>
      </div>
    );
  }

  const canChat = document.status === "processed";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      {/* Page title */}
      <div>
        <Link
          href={ROUTES.DOCUMENTS}
          className="mb-3 inline-flex items-center gap-1.5 text-caption text-muted transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          My documents
        </Link>
        <h2 className="flex items-center gap-2 text-heading text-foreground">
          AI document assistant <Sparkles size={20} className="text-accent" />
        </h2>
        <p className="mt-1 text-body text-muted">Ask questions and explore insights from your documents.</p>
      </div>

      {/* Document picker */}
      <section className="rounded-card border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-body font-semibold text-foreground">Choose a document to chat with</h3>
          <StatusBadge status={document.status} />
        </div>
        <div className="relative">
          <select
            value={documentId}
            onChange={(e) => router.push(`${ROUTES.DOCUMENTS}/${e.target.value}`)}
            className="h-control w-full appearance-none rounded-control border border-border bg-input pr-10 pl-4 text-body text-foreground outline-none transition focus:border-ring"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fileName}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
        </div>
      </section>

      {/* Conversation */}
      <section className="flex flex-col overflow-hidden rounded-card border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-body font-semibold text-foreground">Document conversation</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <Sparkles size={12} /> AI answers with document context
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            disabled={!messages.length || isSending}
            className="flex items-center gap-2 rounded-control border border-border px-3 py-2 text-caption text-foreground-secondary transition hover:text-accent disabled:opacity-50 disabled:hover:text-foreground-secondary"
          >
            <RotateCcw size={16} />
            Clear chat
          </button>
        </div>

        <div ref={messagesRef} className="flex h-[55vh] min-h-80 flex-col gap-4 overflow-y-auto px-5 py-5">
          {document.status === "processing" && (
            <Notice>
              <Loader2 size={16} className="animate-spin" />
              This document is still being processed. You can ask questions once it&apos;s ready.
            </Notice>
          )}
          {document.status === "failed" && (
            <Notice isError>
              <CircleAlert size={16} />
              {document.errorMessage || "This document could not be processed. Please upload it again."}
            </Notice>
          )}

          {/* Welcome message for a new conversation */}
          {messages.length === 0 && (
            <MessageBubble role="assistant">
              Hello! I&apos;m your document assistant. Ask me anything about{" "}
              <span className="font-semibold">{document.fileName}</span>.
            </MessageBubble>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role}>
              {msg.message}
            </MessageBubble>
          ))}

          {isSending && (
            <MessageBubble role="assistant">
              <span className="flex items-center gap-2 text-muted">
                <Loader2 size={16} className="animate-spin" />
                Thinking...
              </span>
            </MessageBubble>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4">
          {error && (
            <p className="flex items-center gap-2 text-caption text-danger">
              <CircleAlert size={16} />
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(({ label, question }) => (
              <button
                key={label}
                type="button"
                onClick={() => sendMessage(question)}
                disabled={!canChat || isSending}
                className="rounded-control border border-border px-3 py-2 text-caption text-foreground-secondary transition hover:border-border-accent hover:text-accent disabled:opacity-50 disabled:hover:border-border disabled:hover:text-foreground-secondary"
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your document..."
              maxLength={2000}
              disabled={!canChat}
              className="h-control flex-1 rounded-control border border-border bg-input px-4 text-body text-foreground outline-none transition placeholder:text-placeholder focus:border-ring disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!canChat || isSending || !input.trim()}
              aria-label="Send message"
              className="flex size-control shrink-0 items-center justify-center rounded-control bg-linear-to-r from-primary to-primary-to text-primary-foreground shadow-primary transition hover:from-primary-hover hover:to-primary-to-hover disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function MessageBubble({ role, children }: { role: ChatMessage["role"]; children: React.ReactNode }) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "max-w-[80%] rounded-card px-4 py-3 text-body whitespace-pre-wrap",
        isUser
          ? "self-end bg-linear-to-r from-primary to-primary-to text-primary-foreground"
          : "self-start border border-border bg-input text-foreground"
      )}
    >
      {children}
    </div>
  );
}

function Notice({ isError, children }: { isError?: boolean; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 rounded-control border px-4 py-3 text-caption",
        isError ? "border-danger/30 bg-danger/10 text-danger" : "border-warning/30 bg-warning/10 text-warning"
      )}
    >
      {children}
    </p>
  );
}
