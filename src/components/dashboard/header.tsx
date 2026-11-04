"use client"; // Needed for the sign-out click handler

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { logout } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { useClientValue } from "@/lib/use-client-value";

// e.g. "Monday, November 2, 2026"
function getToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function Header() {
  const router = useRouter();
  const today = useClientValue(getToday, "");

  const handleLogout = async () => {
    await logout();
    // replace + refresh so Back doesn't show a cached signed-in page.
    router.replace(ROUTES.LOGIN);
    router.refresh();
  };

  // TODO: show user name and initial from the signed-in user
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <div>
        <h1 className="text-base font-semibold text-foreground">Home</h1>
        <p className="min-h-4 text-xs text-muted">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`${ROUTES.DASHBOARD}#upload`}
          className="flex items-center gap-2 rounded-control border border-border px-4 py-2 text-body text-foreground-secondary transition hover:text-accent"
        >
          <Plus size={18} />
          Upload
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-control border border-border px-4 py-2 text-body text-foreground-secondary transition hover:text-accent"
        >
          <LogOut size={18} />
          Sign out
        </button>

        <span className="flex size-9 items-center justify-center rounded-full bg-surface-raised text-body font-semibold text-accent">
          D
        </span>
      </div>
    </header>
  );
}
