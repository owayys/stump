import favicon from "@assets/stump-mark.svg?url"
import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import DefaultErrorBoundary from "@/components/layout/DefaultErrorBoundary"
import { Toaster } from "@/components/ui/sonner"
import { sessionQueryOptions } from "@/shared/hooks/auth-hooks"
import { seo } from "@/shared/seo"
import styles from "./styles.css?url"

export interface RouterAppContext {
  queryClient: QueryClient
}

const RootDocument = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackDevtools
          plugins={[
            { name: "Router", render: <TanStackRouterDevtoolsPanel /> },
            { name: "Rquery", render: <ReactQueryDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

const RootComponent = () => (
  <RootDocument>
    <Outlet />
  </RootDocument>
)

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  errorComponent: (props) => (
    <RootDocument>
      <DefaultErrorBoundary {...props} />
    </RootDocument>
  ),
  beforeLoad: async ({ context }) => {
    const session =
      await context.queryClient.ensureQueryData(sessionQueryOptions)
    return { user: session?.user ?? null }
  },

  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Stump",
        description: "Full-stack TypeScript starter.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: styles },
      { rel: "icon", type: "image/svg+xml", href: favicon },
    ],
  }),
})
