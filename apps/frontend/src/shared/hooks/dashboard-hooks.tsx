import { orpc } from "@/shared/orpc"

export const dashboardStatsQueryOptions =
  orpc.authenticated.groceryList.getStats.queryOptions()

export const recentListsQueryOptions =
  orpc.authenticated.groceryList.fetchRecentLists.queryOptions({
    select: (data) => data.items,
  })
