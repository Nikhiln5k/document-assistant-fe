"use client"; // Needed for the sign-out click handler

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // replace + refresh so Back doesn't show a cached signed-in page.
    router.replace(ROUTES.LOGIN);
    router.refresh();
  };

  // TODO: show user name
  return (
    <header className="flex justify-end p-4">
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-control border border-border px-4 py-2 text-body text-foreground-secondary transition hover:text-accent"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </header>
  );
}
