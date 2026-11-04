import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import type { AppRouterClient } from "@repo/contract/contracts"
import { forwardedCookie } from "@/shared/auth-client"

const link = new RPCLink({
  origin: import.meta.env.VITE_SERVER_URL,
  url: "/rpc",
  headers: () => forwardedCookie(),
  fetch: (url, init) =>
    globalThis.fetch(url, { ...init, credentials: "include" }),
})

const orpcClient: AppRouterClient = createORPCClient(link)

export const orpc = createTanstackQueryUtils(orpcClient)
