// URL: /dashboard/documents/:id
import { Suspense } from "react";
import { DocumentChat } from "@/components/documents/document-chat";

export const metadata = { title: "Document assistant" };

export default function DocumentChatPage({ params }: { params: Promise<{ id: string }> }) {
  // params is request-time data, so it must be read inside a Suspense boundary.
  return (
    <Suspense>
      <DocumentChatLoader params={params} />
    </Suspense>
  );
}

async function DocumentChatLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // key resets the chat state when switching to another document.
  return <DocumentChat key={id} documentId={id} />;
}
