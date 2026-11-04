import { RPCJsonSerializer } from "@orpc/client"
import { QueryClient } from "@tanstack/react-query"

const orpcSerializer = new RPCJsonSerializer()

// One per request on the server; a shared client would leak data between users
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 120 * 1000,
        refetchOnWindowFocus: false,
      },

      dehydrate: {
        serializeData: (data) => orpcSerializer.serializeJson(data),
      },
      hydrate: {
        deserializeData: (data) => orpcSerializer.deserializeJson(data),
      },
    },
  })
