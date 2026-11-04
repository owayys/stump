import { z } from "zod"

export const DashboardStatsSchema = z.object({
  totalLists: z.number(),
  recentLists: z.number(),
  completedToday: z.number(),
  pendingItems: z.number(),
})

export type DashboardStats = z.output<typeof DashboardStatsSchema>
