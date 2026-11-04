import {
  type Item,
  ItemEntity,
} from "@repo/domain/grocery-list-item/item.entity"
import type { User } from "@repo/domain/user/user.entity"
import type { Forbidden } from "@repo/domain/utils/errors"
import type { Result } from "better-result"
import { type GroceryList, GroceryListEntity } from "./grocery-list.entity"
import type {
  GroceryListDetails,
  NewGroceryListData,
} from "./grocery-list.schemas"

const calculateDetailedStats = (items: Item[]): GroceryListDetails["stats"] => {
  const totalItems = items.length
  const pendingItems = items.filter(ItemEntity.isPending).length
  const completedItems = items.filter(ItemEntity.isBought).length
  const completionPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return {
    totalItems,
    pendingItems,
    completedItems,
    completionPercentage: Math.round(completionPercentage * 100) / 100,
  }
}

export const GroceryListService = {
  calculateDetailedStats,

  details: (
    list: GroceryList,
    owner: User,
    items: Item[],
  ): Result<GroceryListDetails, Forbidden> =>
    GroceryListEntity.ensureOwner(list, owner).map(
      ({ ownerId: _, ...listData }) => ({
        ...listData,
        items,
        owner,
        stats: calculateDetailedStats(items),
      }),
    ),

  completionStatus: (items: Item[]) => {
    if (items.length === 0) return "empty"

    const completionRatio =
      items.filter(ItemEntity.isBought).length / items.length

    if (completionRatio === 0) return "just-started"
    if (completionRatio === 1) return "completed"
    if (completionRatio >= 0.8) return "nearly-complete"
    return "in-progress"
  },

  createNewList: (data: NewGroceryListData, owner: User) => {
    const list = GroceryListEntity.create(data, owner)
    const items = data.items.map((itemData) =>
      ItemEntity.create(itemData, list, owner),
    )

    return { list, items }
  },
}
