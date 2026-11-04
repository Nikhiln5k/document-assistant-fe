import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

// Returns `fallback` on the server and getValue() in the browser.
// Use it for values that differ per visitor, like the local date or time.
export function useClientValue<T>(getValue: () => T, fallback: T): T {
  return useSyncExternalStore(noopSubscribe, getValue, () => fallback);
}
