import { createGroceryListWorkflows } from "@repo/application/workflows"
import { createAuth } from "@/infra/auth"
import { createDb } from "@/infra/db/conn"
import { createGroceryListRepository } from "@/infra/db/repos/grocery-list.repository"
import { createItemRepository } from "@/infra/db/repos/item.repository"

export const createDeps = () => {
  const db = createDb()
  const auth = createAuth(db)

  return {
    auth,
    groceryLists: createGroceryListWorkflows({
      lists: createGroceryListRepository(db),
      items: createItemRepository(db),
    }),
  }
}

export type Deps = ReturnType<typeof createDeps>
