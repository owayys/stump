import { createFileRoute } from "@tanstack/react-router"
import { GroceryListsListPage } from "@/pages/lists/list-page"
import {
  ListsSearchSchema,
  listsQueryOptions,
} from "@/shared/hooks/lists-hooks"

export const Route = createFileRoute("/_private/lists/")({
  component: GroceryListsListPage,
  head: () => ({ meta: [{ title: "All Lists" }] }),
  validateSearch: ListsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(listsQueryOptions(deps)),
})
