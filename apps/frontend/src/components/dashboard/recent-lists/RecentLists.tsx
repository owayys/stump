import type { GroceryListSummary } from "@repo/domain/grocery-list/grocery-list.schemas"
import { Link } from "@tanstack/react-router"
import { ListCard } from "@/components/shared/ListCard"
import { Button } from "@/components/ui/button"

type RecentListsProps = {
  lists: readonly GroceryListSummary[]
}

export const RecentLists = ({ lists }: RecentListsProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-xl">Recent Lists</h3>
      <Button asChild size="sm" variant="ghost">
        <Link to="/lists">View All Lists</Link>
      </Button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  </div>
)
