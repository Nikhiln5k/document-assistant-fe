import type { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";

// Add app-wide providers here (theme, query client, toasts...) as they are needed.
function AppProviders({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default AppProviders;
