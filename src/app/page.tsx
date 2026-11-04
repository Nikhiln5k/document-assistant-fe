// URL: /  (sends the user straight to the dashboard)
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return redirect(ROUTES.LOGIN);
  }
  redirect(ROUTES.DASHBOARD);
}
