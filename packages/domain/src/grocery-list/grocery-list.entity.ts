import { type User, UserId } from "@repo/domain/user/user.entity"
import { entityTimestamps, newEntityFields } from "@repo/domain/utils/entity"
import { Forbidden } from "@repo/domain/utils/errors"
import { Result } from "better-result"
import { z } from "zod"

export const GroceryListId = z.uuid().brand<"GroceryListId">()

export const GroceryListSchema = z.object({
  id: GroceryListId,
  ...entityTimestamps,
  name: z.string().min(3),
  description: z.string(),
  active: z.boolean(),
  ownerId: UserId,
})
export type GroceryList = z.output<typeof GroceryListSchema>

export const GroceryListCreateSchema = GroceryListSchema.pick({
  name: true,
  description: true,
})
export type GroceryListCreateData = z.output<typeof GroceryListCreateSchema>

export const GroceryListUpdateSchema = GroceryListSchema.pick({
  name: true,
  description: true,
  active: true,
}).partial()
export type GroceryListUpdateData = z.output<typeof GroceryListUpdateSchema>

const isOwner = (list: GroceryList, userId: User["id"]) =>
  list.ownerId === userId

const ensureOwner = (
  list: GroceryList,
  user: User,
): Result<GroceryList, Forbidden> =>
  isOwner(list, user.id)
    ? Result.ok(list)
    : Result.err(
        new Forbidden({
          message: "You are not the owner of this grocery list",
        }),
      )

export const GroceryListEntity = {
  create: (data: GroceryListCreateData, owner: User): GroceryList => ({
    ...newEntityFields(GroceryListId),
    ...data,
    ownerId: owner.id,
    active: false,
  }),

  isOwner,
  ensureOwner,

  update: (
    list: GroceryList,
    data: GroceryListUpdateData,
    user: User,
  ): Result<GroceryList, Forbidden> =>
    ensureOwner(list, user).map((owned) => ({
      ...owned,
      ...data,
      updatedAt: new Date(),
    })),
}
