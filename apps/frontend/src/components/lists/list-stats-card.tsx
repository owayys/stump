import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type ListStatsData = {
  totalItems: number
  completedItems: number
  pendingItems: number
  completionPercentage: number
}

export const ListStatsCard = ({ stats }: { stats: ListStatsData }) => (
  <div className="flex flex-col gap-4 rounded-lg border bg-muted/40 p-4">
    <div className="flex items-center justify-between">
      <span className="font-medium text-lg">Items ({stats.totalItems})</span>
      <Badge variant="secondary">
        {stats.completedItems}/{stats.totalItems} completed
      </Badge>
    </div>
    {stats.totalItems > 0 && <Progress value={stats.completionPercentage} />}
  </div>
)
