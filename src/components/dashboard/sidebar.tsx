import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function Sidebar() {
  // TODO: add more links as new pages are created
  return (
    <aside>
      <nav>
        <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
      </nav>
    </aside>
  );
}
