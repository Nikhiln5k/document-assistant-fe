"use client"; // Needed for usePathname to highlight the active link

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutGrid, Settings, Sparkles, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const WORKSPACE_LINKS: NavItem[] = [
  { label: "Overview", href: ROUTES.DASHBOARD, icon: LayoutGrid },
  { label: "My documents", href: ROUTES.DOCUMENTS, icon: FileText },
  { label: "AI assistant", href: ROUTES.ASSISTANT, icon: Sparkles },
];

const PREFERENCE_LINKS: NavItem[] = [
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-sidebar shrink-0 flex-col border-r border-border bg-surface px-3 py-5 md:flex">
      <Link href={ROUTES.DASHBOARD} className="mb-8 flex items-center gap-3 px-2">
        <Image
          src="/assets/documind-logo-dark.png"
          alt="Documind"
          width={2170}
          height={720}
          // Matches .login-logo (w-56 / sm:w-64) so browser fetches a ~256px variant, not the 217original
          sizes="(min-width: 640px) 16rem, 14rem"
          preload
          className="login-logo-image login-logo-dark"
        />
      </Link>

      <nav className="flex flex-col gap-8">
        <NavSection title="Workspace" links={WORKSPACE_LINKS} />
        <NavSection title="Preferences" links={PREFERENCE_LINKS} />
      </nav>
    </aside>
  );
}

function NavSection({ title, links }: { title: string; links: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div>
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
      <ul className="flex flex-col gap-1">
        {links.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-control px-3 py-2.5 text-body transition",
                  isActive
                    ? "bg-surface-raised font-semibold text-accent"
                    : "text-foreground-secondary hover:bg-surface-raised hover:text-foreground"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
