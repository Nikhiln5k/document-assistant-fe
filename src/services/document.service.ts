// Document API calls: upload, list, view, delete and chat.
import type {
  ApiResponse,
  ChatExchange,
  ChatMessage,
  DocumentItem,
  ListDocumentsParams,
} from "@/types/document";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { del, get, post } from "./api";

export async function getDocuments(params: ListDocumentsParams = {}): Promise<DocumentItem[]> {
  const response = await get<ApiResponse<DocumentItem[]>>(API_ENDPOINTS.documents, { params });
  return response.data;
}

export async function getDocument(id: string): Promise<DocumentItem> {
  const response = await get<ApiResponse<DocumentItem>>(`${API_ENDPOINTS.documents}/${id}`);
  return response.data;
}

export async function uploadDocument(file: File): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append("file", file);
  // Large files can take longer than the default timeout to upload.
  const response = await post<ApiResponse<DocumentItem>>(API_ENDPOINTS.uploadDocument, formData, {
    timeout: 120000,
  });
  return response.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await del(`${API_ENDPOINTS.documents}/${id}`);
}

export async function getChatMessages(documentId: string): Promise<ChatMessage[]> {
  const response = await get<ApiResponse<ChatMessage[]>>(
    `${API_ENDPOINTS.documents}/${documentId}/messages`,
  );
  return response.data;
}

export async function sendChatMessage(documentId: string, message: string): Promise<ChatExchange> {
  // The AI answer can take a while, so allow more time than usual.
  const response = await post<ApiResponse<ChatExchange>>(
    `${API_ENDPOINTS.documents}/${documentId}/messages`,
    { message },
    { timeout: 120000 },
  );
  return response.data;
}

export async function clearChatMessages(documentId: string): Promise<void> {
  await del(`${API_ENDPOINTS.documents}/${documentId}/messages`);
}
