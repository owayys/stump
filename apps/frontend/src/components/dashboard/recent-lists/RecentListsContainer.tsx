import { useSuspenseQuery } from "@tanstack/react-query"
import { recentListsQueryOptions } from "@/shared/hooks/dashboard-hooks"
import { RecentLists } from "./RecentLists"
import { RecentListsEmpty } from "./RecentListsEmpty"

export const RecentListsContainer = () => {
  const { data: lists } = useSuspenseQuery(recentListsQueryOptions)

  if (lists.length === 0) {
    return <RecentListsEmpty />
  }

  return <RecentLists lists={lists} />
}
