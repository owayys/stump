import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi, Link } from "@tanstack/react-router"
import { Plus, Search } from "lucide-react"
import { ListCard } from "@/components/shared/ListCard"
import { Button } from "@/components/ui/button"
import { Input, NativeSelect } from "@/components/ui/input"
import {
  ListsSearchSchema,
  listsQueryOptions,
} from "@/shared/hooks/lists-hooks"
import { useDebouncedCallback } from "@/shared/hooks/use-debounced-callback"

const listsRoute = getRouteApi("/_private/lists/")

export const GroceryListsListPage = () => {
  const navigate = listsRoute.useNavigate()
  const searchParams = listsRoute.useSearch()
  const { data } = useSuspenseQuery(listsQueryOptions(searchParams))

  const setSearch = useDebouncedCallback((search: string) => {
    navigate({
      search: (prev) => ({ ...prev, page: 1, search }),
      replace: true,
    })
  }, 300)

  const lists = data.items
  const isFiltered = Boolean(searchParams.search || searchParams.status)

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-semibold text-2xl">All Grocery Lists</h2>
        <Button asChild>
          <Link to="/lists/new">
            <Plus />
            Create New List
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            defaultValue={searchParams.search}
            enterKeyHint="search"
            inputMode="search"
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Search lists..."
          />
        </div>
        <NativeSelect
          aria-label="Filter by status"
          className="w-40"
          onChange={(e) =>
            navigate({
              search: (prev) => ({
                ...prev,
                status: ListsSearchSchema.shape.status.parse(e.target.value),
              }),
            })
          }
          value={searchParams.status}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </NativeSelect>
      </div>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-lg text-muted-foreground">
            {isFiltered
              ? "No lists match your filters"
              : "No grocery lists found"}
          </p>
          <p className="text-muted-foreground">
            {isFiltered
              ? "Try adjusting your search or filters"
              : "Create your first grocery list to get started"}
          </p>
          {!isFiltered && (
            <Button asChild>
              <Link to="/lists/new">
                <Plus />
                Create Your First List
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  )
}
