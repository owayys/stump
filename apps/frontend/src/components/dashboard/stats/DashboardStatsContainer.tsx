import { useSuspenseQuery } from "@tanstack/react-query"
import { dashboardStatsQueryOptions } from "@/shared/hooks/dashboard-hooks"
import { DashboardStats } from "./DashboardStats"

export const DashboardStatsContainer = () => {
  const { data: stats } = useSuspenseQuery(dashboardStatsQueryOptions)

  return <DashboardStats stats={stats} />
}
