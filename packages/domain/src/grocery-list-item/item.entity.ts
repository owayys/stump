import {
  type GroceryList,
  GroceryListEntity,
  GroceryListId,
} from "@repo/domain/grocery-list/grocery-list.entity"
import { type User, UserId } from "@repo/domain/user/user.entity"
import { entityTimestamps, newEntityFields } from "@repo/domain/utils/entity"
import { Forbidden, invalid, type Validation } from "@repo/domain/utils/errors"
import { Result } from "better-result"
import { z } from "zod"

export const ItemId = z.uuid().brand<"ItemId">()
export const ItemStatusSchema = z.enum(["pending", "bought"])

export const ItemSchema = z.object({
  id: ItemId,
  ...entityTimestamps,
  listId: GroceryListId,
  name: z.string().min(1),
  quantity: z.number().positive(),
  notes: z.string().nullable(),
  status: ItemStatusSchema,
  createdBy: UserId,
})
export type Item = z.output<typeof ItemSchema>
export type ItemStatus = Item["status"]

export const ItemCreateSchema = ItemSchema.pick({
  name: true,
  quantity: true,
  notes: true,
})
export type ItemCreateData = z.output<typeof ItemCreateSchema>

export const ItemUpdateSchema = ItemSchema.pick({
  name: true,
  quantity: true,
  status: true,
  notes: true,
}).partial()
export type ItemUpdateData = z.output<typeof ItemUpdateSchema>

const ensureBelongsToList = (
  item: Item,
  list: GroceryList,
): Result<Item, Validation> =>
  item.listId === list.id
    ? Result.ok(item)
    : Result.err(
        invalid([
          {
            field: "itemId",
            value: item.id,
            message: "Item does not belong to the specified list",
          },
        ]),
      )

const ensureCanBeModifiedBy = (
  item: Item,
  list: GroceryList,
  user: User,
): Result<Item, Forbidden> =>
  item.createdBy === user.id || GroceryListEntity.isOwner(list, user.id)
    ? Result.ok(item)
    : Result.err(
        new Forbidden({
          message: "You are not authorized to modify this item",
        }),
      )

export const ItemEntity = {
  create: (data: ItemCreateData, list: GroceryList, owner: User): Item => ({
    ...newEntityFields<Item["id"]>(),
    ...data,
    listId: list.id,
    createdBy: owner.id,
    status: "pending",
  }),

  isPending: (item: Item) => item.status === "pending",
  isBought: (item: Item) => item.status === "bought",

  ensureBelongsToList,
  ensureCanBeModifiedBy,

  update: (
    item: Item,
    list: GroceryList,
    data: ItemUpdateData,
    user: User,
  ): Result<Item, Forbidden | Validation> =>
    ensureBelongsToList(item, list)
      .andThen((owned) => ensureCanBeModifiedBy(owned, list, user))
      .map((modifiable) => ({
        ...modifiable,
        ...data,
        updatedAt: new Date(),
      })),
}
