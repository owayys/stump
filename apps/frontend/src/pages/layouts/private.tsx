import { Link, Outlet } from "@tanstack/react-router"
import { Home, List, Plus, User, UserPlus } from "lucide-react"
import type { ReactNode } from "react"
import LogoutBtn from "@/components/auth/LogoutBtn"
import { cn } from "@/lib/utils"
import type { ValidAppLink } from "@/types"

const navItemClasses =
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors"

const NavItem = ({
  to,
  icon,
  label,
}: {
  to: ValidAppLink
  icon: ReactNode
  label: string
}) => (
  <Link
    activeOptions={{ exact: true }}
    activeProps={{ className: "bg-accent text-accent-foreground" }}
    className={cn(navItemClasses, "hover:bg-accent/50 hover:text-foreground")}
    to={to}
  >
    {icon}
    {label}
  </Link>
)

const UpcomingNavItem = ({
  icon,
  label,
}: {
  icon: ReactNode
  label: string
}) => (
  <span className={cn(navItemClasses, "cursor-not-allowed opacity-50")}>
    {icon}
    {label}
  </span>
)

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="px-3 pt-4 pb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
    {children}
  </p>
)

export function PrivatePageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-center border-b">
        <span className="font-bold text-lg">Grocery Tracker</span>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r p-3 sm:flex">
          <nav className="flex flex-1 flex-col gap-1">
            <SectionLabel>Navigation</SectionLabel>
            <NavItem
              icon={<Home className="size-4" />}
              label="Dashboard"
              to="/"
            />
            <NavItem
              icon={<List className="size-4" />}
              label="All Lists"
              to="/lists"
            />
            <NavItem
              icon={<Plus className="size-4" />}
              label="Create List"
              to="/lists/new"
            />

            <SectionLabel>To Add</SectionLabel>
            <UpcomingNavItem
              icon={<UserPlus className="size-4" />}
              label="List Collaborators"
            />
            <UpcomingNavItem
              icon={<User className="size-4" />}
              label="Profile"
            />
          </nav>

          <div className="border-t pt-3">
            <LogoutBtn />
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
