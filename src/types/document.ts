// Shapes of the document and chat data returned by the backend.
export type DocumentStatus = "processing" | "processed" | "failed";

export type DocumentFileType = "pdf" | "excel" | "word" | "image" | "text";

export interface DocumentItem {
  id: string;
  userId: string;
  fileName: string;
  fileType: DocumentFileType;
  mimeType: string | null;
  fileSize: number;
  status: DocumentStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListDocumentsParams {
  search?: string;
  type?: DocumentFileType;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  documentId: string;
  role: ChatRole;
  message: string;
  createdAt: string;
}

// Returned when a question is sent: the saved question and the AI answer.
export interface ChatExchange {
  question: ChatMessage;
  answer: ChatMessage;
}

// Every backend response is wrapped as { statusCode, data, message }.
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}
