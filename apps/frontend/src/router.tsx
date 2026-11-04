import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import DefaultErrorBoundary from "@/components/layout/DefaultErrorBoundary"
import PageNotFound from "@/components/layout/PageNotFound"
import { PageSuspenseFallback } from "@/components/layout/PageSuspenseFallback"
import { routeTree } from "@/routeTree.gen"
import { createQueryClient } from "@/shared/query-client"

export const getRouter = () => {
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
    defaultPreload: "intent",
    defaultPendingComponent: PageSuspenseFallback,
    defaultNotFoundComponent: () => <PageNotFound />,
    defaultErrorComponent: DefaultErrorBoundary,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
