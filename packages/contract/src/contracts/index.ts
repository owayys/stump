import type { RouterContractClient } from "@orpc/contract"
import groceryListContract from "./grocery-list"
import userContract from "./user"

export { ERROR_STATUS_MAP } from "@repo/contract/utils/oc.base"

export const CONTRACT = {
  authenticated: {
    user: userContract,
    groceryList: groceryListContract,
  },
}

export type AppRouterClient = RouterContractClient<typeof CONTRACT>
