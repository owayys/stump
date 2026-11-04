import type { GroceryListSummary } from "@repo/domain/grocery-list/grocery-list.schemas"
import { Link } from "@tanstack/react-router"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ListCardProps = {
  list: GroceryListSummary
}

export const ListCard = ({ list }: ListCardProps) => (
  <Card className="py-4">
    <CardContent className="flex flex-col gap-3 px-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium text-lg">{list.name}</span>
        <Badge variant={list.active ? "default" : "secondary"}>
          {list.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <p className="line-clamp-2 text-muted-foreground text-sm">
        {list.description || "No description"}
      </p>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Clock className="size-4" />
          Updated {new Date(list.updatedAt).toLocaleDateString()}
        </span>
        <Button asChild size="sm" variant="secondary">
          <Link params={{ id: list.id }} preload="intent" to="/lists/$id">
            View
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
)
