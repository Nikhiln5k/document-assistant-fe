// Dashboard API calls.
import type { DashboardStats } from "@/types/dashboard";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import { get } from "./api";

export async function getDashboardStats(): Promise<DashboardStats> {
  return get<DashboardStats>(API_ENDPOINTS.dashboardStats);
}
