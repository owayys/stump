import { type } from "@orpc/contract"
import { openapi } from "@orpc/openapi"
import { DashboardStatsSchema } from "@repo/application/schemas/dashboard"
import { appAuthenticatedBase } from "@repo/contract/utils/oc.base"
import {
  GroceryListId,
  GroceryListUpdateSchema,
} from "@repo/domain/grocery-list/grocery-list.entity"
import {
  GetListsParamsSchema,
  GetListsResultSchema,
  GroceryListDetailsSchema,
  NewGroceryListSchema,
} from "@repo/domain/grocery-list/grocery-list.schemas"
import { z } from "zod"

const groceryListBase = appAuthenticatedBase

const groceryListIdStruct = z.object({
  id: GroceryListId,
})

export const getStats = groceryListBase
  .meta(
    openapi({
      method: "GET",
      path: "/grocery-list/stats",
      summary: "Get grocery list statistics for dashboard",
      tags: ["grocery-list"],
    }),
  )
  .input(type<void>())
  .output(DashboardStatsSchema)

export const getLists = groceryListBase
  .meta(
    openapi({
      method: "GET",
      path: "/grocery-list",
      summary: "Get grocery lists with optional filters and pagination",
      tags: ["grocery-list"],
    }),
  )
  .input(GetListsParamsSchema)
  .output(GetListsResultSchema)

export const fetchRecentLists = groceryListBase
  .meta(
    openapi({
      method: "GET",
      path: "/grocery-list/recent",
      summary: "Get recent grocery lists",
      tags: ["grocery-list"],
    }),
  )
  .input(type<void>())
  .output(GetListsResultSchema)

export const getListById = groceryListBase
  .meta(
    openapi({
      method: "GET",
      path: "/grocery-list/{id}",
      summary: "Get a grocery list by ID",
      tags: ["grocery-list"],
      inputStructure: "detailed",
    }),
  )
  .input(
    z.object({
      params: groceryListIdStruct,
    }),
  )
  .output(GroceryListDetailsSchema)

export const createGroceryList = groceryListBase
  .meta(
    openapi({
      method: "POST",
      path: "/grocery-list",
      summary: "Create a new grocery list",
      tags: ["grocery-list"],
    }),
  )
  .input(NewGroceryListSchema)
  .output(GroceryListDetailsSchema)

export const updateGroceryList = groceryListBase
  .meta(
    openapi({
      method: "PATCH",
      path: "/grocery-list/{id}",
      summary: "Update a grocery list",
      tags: ["grocery-list"],
      inputStructure: "detailed",
    }),
  )
  .input(
    z.object({
      params: groceryListIdStruct,
      body: GroceryListUpdateSchema,
    }),
  )
  .output(GroceryListDetailsSchema)

export const deleteGroceryList = groceryListBase
  .meta(
    openapi({
      method: "DELETE",
      path: "/grocery-list/{id}",
      summary: "Delete a grocery list",
      tags: ["grocery-list"],
      inputStructure: "detailed",
    }),
  )
  .input(
    z.object({
      params: groceryListIdStruct,
    }),
  )
  .output(groceryListIdStruct)

export default {
  getStats,
  getLists,
  fetchRecentLists,
  getListById,
  createGroceryList,
  updateGroceryList,
  deleteGroceryList,
}
