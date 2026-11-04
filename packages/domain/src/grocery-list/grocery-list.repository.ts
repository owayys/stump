import type { Item } from "@repo/domain/grocery-list-item/item.entity"
import type { User } from "@repo/domain/user/user.entity"
import type { RepoResult } from "@repo/domain/utils"
import type { NotFound } from "@repo/domain/utils/errors"
import type {
  Paginated,
  PaginationParams,
} from "@repo/domain/utils/pagination.utils"
import type { GroceryList } from "./grocery-list.entity"

export type GroceryListFindFilters = {
  userId?: User["id"]
  search?: string
  status?: "active" | "inactive"
  since?: Date
}

export interface GroceryListRepository {
  create(list: GroceryList, items: Item[]): RepoResult<GroceryList>
  findById(id: GroceryList["id"]): RepoResult<GroceryList, NotFound>
  update(list: GroceryList): RepoResult<GroceryList, NotFound>
  delete(id: GroceryList["id"]): RepoResult<void, NotFound>
  findByUserId(userId: User["id"]): RepoResult<GroceryList[]>
  findWithFilters(
    filters: GroceryListFindFilters,
    pagination: PaginationParams,
  ): RepoResult<Paginated<GroceryList>>
  count(filters: GroceryListFindFilters): Promise<number>
}
