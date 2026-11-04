import { createFileRoute } from "@tanstack/react-router"
import { DashboardPage } from "@/pages/dashboard"
import {
  dashboardStatsQueryOptions,
  recentListsQueryOptions,
} from "@/shared/hooks/dashboard-hooks"

const Home = () => {
  const { user } = Route.useRouteContext()

  return <DashboardPage user={user} />
}

export const Route = createFileRoute("/_private/")({
  component: Home,
  head: () => ({ meta: [{ title: "Dashboard" }] }),
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.ensureQueryData(recentListsQueryOptions),
      queryClient.ensureQueryData(dashboardStatsQueryOptions),
    ]),
})
