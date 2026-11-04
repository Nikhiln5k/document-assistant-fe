"use client";

// Error boundaries must be Client Components
export default function Error({ retry }: { error: unknown; retry: () => void }) {
  // TODO: report error
  return (
    <main>
      <h1>Something went wrong</h1>
      <button onClick={() => retry()}>Try again</button>
    </main>
  );
}
