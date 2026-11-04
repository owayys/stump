import { Link } from "@tanstack/react-router"
import { List } from "lucide-react"
import { Button } from "@/components/ui/button"

export const RecentListsEmpty = () => (
  <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
    <List className="size-16 text-muted-foreground" strokeWidth={1.5} />
    <div className="grid gap-1">
      <h4 className="font-semibold text-lg">No recent lists yet</h4>
      <p className="text-muted-foreground">
        Create your first grocery list to get started with organizing your
        shopping.
      </p>
    </div>
    <Button asChild>
      <Link to="/lists/new">Create Your First List</Link>
    </Button>
  </div>
)
