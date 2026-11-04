// URL: /dashboard
import Link from "next/link";
import { Plus } from "lucide-react";
import { Greeting } from "@/components/dashboard/greeting";
import { StatCard } from "@/components/dashboard/stat-card";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { ROUTES } from "@/constants/routes";

export const metadata = { title: "Dashboard" };

// TODO: replace with the signed-in user and getDashboardStats()
const userName = "demo";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Greeting name={userName} />
          <p className="mt-1 text-body text-muted">
            Your knowledge hub is ready. What would you like to explore?
          </p>
        </div>

        <Link
          href={`${ROUTES.DASHBOARD}#upload`}
          className="flex items-center gap-2 rounded-control bg-linear-to-r from-primary to-primary-to px-5 py-3 font-semibold text-primary-foreground shadow-primary transition hover:from-primary-hover hover:to-primary-to-hover"
        >
          <Plus size={18} />
          Upload document
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total documents" value={3} hint="In your workspace" />
        <StatCard
          label="Processed"
          value={3}
          hint={<span className="text-success">✓ Ready to query</span>}
        />
        <StatCard label="AI summaries" value={12} hint="Generated insights" />
        <StatCard
          label="Storage used"
          value={
            <>
              8.4 <span className="text-body font-semibold text-muted">MB</span>
            </>
          }
          hint="Of 100 MB demo quota"
        />
      </div>

      <UploadZone />
    </div>
  );
}
