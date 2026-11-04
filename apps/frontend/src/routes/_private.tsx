import { createFileRoute, redirect } from "@tanstack/react-router"
import { PrivatePageLayout } from "@/pages/layouts/private"

export const Route = createFileRoute("/_private")({
  component: PrivatePageLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/auth/login",
        search: { redirect: location.href },
      })
    }

    return { user: context.user }
  },
})
