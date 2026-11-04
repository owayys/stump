import type { DashboardStats as TDashboardStats } from "@repo/application/schemas/dashboard"
import { Check, Clock, List, Plus } from "lucide-react"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type DashboardStatsProps = {
  stats: TDashboardStats
}

const StatCard = ({
  title,
  value,
  icon,
  tone,
}: {
  title: string
  value: number
  icon: ReactNode
  tone: string
}) => (
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="font-bold text-muted-foreground text-sm uppercase">
          {title}
        </p>
        <p className="font-bold text-2xl">{value}</p>
      </div>
      <div className={cn("rounded-md p-3", tone)}>{icon}</div>
    </CardContent>
  </Card>
)

export const DashboardStats = ({ stats }: DashboardStatsProps) => (
  <div className="flex flex-col gap-4">
    <h3 className="font-semibold text-xl">Your Stats</h3>
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      <StatCard
        icon={<List className="size-6" />}
        title="Total Lists"
        tone="bg-blue-500/15 text-blue-400"
        value={stats.totalLists}
      />
      <StatCard
        icon={<Clock className="size-6" />}
        title="Recent Lists"
        tone="bg-green-500/15 text-green-400"
        value={stats.recentLists}
      />
      <StatCard
        icon={<Plus className="size-6" />}
        title="Pending Items"
        tone="bg-orange-500/15 text-orange-400"
        value={stats.pendingItems}
      />
      <StatCard
        icon={<Check className="size-6" />}
        title="Completed Today"
        tone="bg-teal-500/15 text-teal-400"
        value={stats.completedToday}
      />
    </div>
  </div>
)
