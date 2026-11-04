import {
  DashboardStatsContainer,
  QuickActions,
  RecentListsContainer,
} from "@/components/dashboard"
import type { AppSession } from "@/shared/auth-client"

type DashboardPageProps = {
  user: AppSession["user"]
}

export const DashboardPage = ({ user }: DashboardPageProps) => (
  <div className="flex flex-col gap-8 p-8">
    <h2 className="font-semibold text-2xl">Welcome back, {user.name}! 👋</h2>
    <QuickActions />
    <DashboardStatsContainer />
    <RecentListsContainer />
  </div>
)
