// URL: /  (sends the user straight to the dashboard)
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cookies } from "next/headers";

// This page only redirects based on the token cookie, so it must wait for the request; allow it to block.
export const instant = false;

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return redirect(ROUTES.LOGIN);
  }
  redirect(ROUTES.DASHBOARD);
}
