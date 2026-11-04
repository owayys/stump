import { createFileRoute, redirect } from "@tanstack/react-router"
import { PublicPageLayout } from "@/pages/layouts/public"

export const Route = createFileRoute("/_public")({
  component: PublicPageLayout,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" })
    }

    return { user: null }
  },
})
