import { Link } from "@tanstack/react-router"
import { List, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-wrap gap-2">
      <Button asChild variant="secondary">
        <Link preload="intent" to="/lists/new">
          <Plus />
          Create New List
        </Link>
      </Button>
      <Button asChild variant="secondary">
        <Link preload="intent" to="/lists">
          <List />
          Browse All Lists
        </Link>
      </Button>
    </CardContent>
  </Card>
)
