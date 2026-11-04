import {
  ItemCreateSchema,
  ItemSchema,
} from "@repo/domain/grocery-list-item/item.entity"
import { UserSchema } from "@repo/domain/user/user.entity"
import {
  PaginatedResultSchema,
  PaginationParamsSchema,
} from "@repo/domain/utils/pagination.utils"
import { z } from "zod"
import {
  GroceryListCreateSchema,
  GroceryListSchema,
} from "./grocery-list.entity"

const GroceryListSummarySchema = GroceryListSchema.omit({ ownerId: true })
export type GroceryListSummary = z.output<typeof GroceryListSummarySchema>

export const NewGroceryListSchema = GroceryListCreateSchema.extend({
  items: z.array(ItemCreateSchema),
})
export type NewGroceryListData = z.output<typeof NewGroceryListSchema>

export const GroceryListFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  sinceMs: z.int().positive().optional(),
})

export const GetListsParamsSchema = z.object({
  filters: GroceryListFiltersSchema,
  pagination: PaginationParamsSchema,
})
export type GetListsParams = z.output<typeof GetListsParamsSchema>

export const GetListsResultSchema = PaginatedResultSchema(
  GroceryListSummarySchema,
)
export type GetListsResult = z.output<typeof GetListsResultSchema>

export const GroceryListDetailsSchema = GroceryListSummarySchema.extend({
  owner: UserSchema,
  items: z.array(ItemSchema),
  stats: z.object({
    totalItems: z.number(),
    pendingItems: z.number(),
    completedItems: z.number(),
    completionPercentage: z.number(),
  }),
})
export type GroceryListDetails = z.output<typeof GroceryListDetailsSchema>
