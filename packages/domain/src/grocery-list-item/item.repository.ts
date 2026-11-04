import type { GroceryList } from "@repo/domain/grocery-list/grocery-list.entity"
import type { User } from "@repo/domain/user/user.entity"
import type { RepoResult } from "@repo/domain/utils"
import type { NotFound } from "@repo/domain/utils/errors"
import type { Item, ItemStatus } from "./item.entity"

export type GroceryItemFilters = {
  userId?: User["id"]
  listId?: GroceryList["id"]
  status?: ItemStatus
  updatedSince?: Date
}

export interface ItemRepository {
  create(item: Item): RepoResult<Item>
  findByList(list: GroceryList): RepoResult<Item[]>
  update(item: Item): RepoResult<Item, NotFound>
  delete(id: Item["id"]): RepoResult<Item, NotFound>
  deleteByList(list: GroceryList): RepoResult<Item["id"][]>
  count(filters: GroceryItemFilters): Promise<number>
}
