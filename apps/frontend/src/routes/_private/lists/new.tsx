import { createFileRoute } from "@tanstack/react-router"
import { NewListPage } from "@/pages/lists/new-list-page"

export const Route = createFileRoute("/_private/lists/new")({
  component: NewListPage,
  head: () => ({ meta: [{ title: "Create New List" }] }),
})
