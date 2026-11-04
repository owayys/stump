import { CheckCircle2, Circle, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ItemDisplayData = Readonly<{
  id?: string
  name: string
  quantity: number
  notes?: string | null
  status?: "pending" | "bought"
}>

export const ListItemDisplay = ({ item }: { item: ItemDisplayData }) => {
  const isCompleted = item.status === "bought"

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        {isCompleted ? (
          <CheckCircle2 className="size-5 text-success" />
        ) : (
          <Circle className="size-5 text-muted-foreground" />
        )}
        <div>
          <p
            className={cn(
              "font-medium",
              isCompleted && "text-muted-foreground line-through",
            )}
          >
            {item.name}
          </p>
          {item.notes && (
            <p className="text-muted-foreground text-sm">{item.notes}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          <Package />
          {item.quantity}
        </Badge>
        <Badge variant={isCompleted ? "success" : "outline"}>
          {item.status || "pending"}
        </Badge>
      </div>
    </div>
  )
}

export const ListItemList = ({
  items,
  emptyMessage = "No items in this list",
}: {
  items: readonly ItemDisplayData[]
  emptyMessage?: string
}) =>
  items.length === 0 ? (
    <p className="py-8 text-center text-muted-foreground">{emptyMessage}</p>
  ) : (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <ListItemDisplay item={item} key={item.id || `item-${index}`} />
      ))}
    </div>
  )
