import type { DashboardStats } from "@repo/application/schemas/dashboard"
import type { DomainError, Paginated, PaginationParams } from "@repo/domain"
import {
  type GroceryList,
  GroceryListEntity,
  type GroceryListUpdateData,
} from "@repo/domain/grocery-list/grocery-list.entity"
import type {
  GroceryListFindFilters,
  GroceryListRepository,
} from "@repo/domain/grocery-list/grocery-list.repository"
import type {
  GetListsParams,
  GroceryListDetails,
  NewGroceryListData,
} from "@repo/domain/grocery-list/grocery-list.schemas"
import { GroceryListService } from "@repo/domain/grocery-list/grocery-list.service"
import type { ItemRepository } from "@repo/domain/grocery-list-item/item.repository"
import type { User } from "@repo/domain/user/user.entity"
import { Result } from "better-result"

type WorkflowResult<T> = Promise<Result<T, DomainError>>

const sevenDaysAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)

  return date
}

export const createGroceryListWorkflows = ({
  lists,
  items,
}: {
  lists: GroceryListRepository
  items: ItemRepository
}) => {
  const fetchWithFilters = (
    filters: GroceryListFindFilters,
    pagination: PaginationParams,
  ): WorkflowResult<Paginated<GroceryList>> =>
    lists.findWithFilters(filters, pagination)

  return {
    fetchGroceryListDetails: (
      id: GroceryList["id"],
      user: User,
    ): WorkflowResult<GroceryListDetails> =>
      Result.gen(async function* () {
        const list = yield* Result.await(lists.findById(id))
        const listItems = yield* Result.await(items.findByList(list))

        return GroceryListService.details(list, user, listItems)
      }),

    createGroceryList: (
      data: NewGroceryListData,
      user: User,
    ): WorkflowResult<GroceryListDetails> =>
      Result.gen(async function* () {
        const created = GroceryListService.createNewList(data, user)

        yield* Result.await(lists.create(created.list, created.items))

        return GroceryListService.details(created.list, user, created.items)
      }),

    getGroceryListsWithFilters: (
      user: User,
      { filters, pagination }: GetListsParams,
    ): WorkflowResult<Paginated<GroceryList>> =>
      fetchWithFilters(
        {
          userId: user.id,
          search: filters.search,
          status: filters.status,
          since: filters.sinceMs
            ? new Date(Date.now() - filters.sinceMs)
            : undefined,
        },
        pagination,
      ),

    fetchRecentLists: (user: User): WorkflowResult<Paginated<GroceryList>> =>
      fetchWithFilters({ userId: user.id, since: sevenDaysAgo() }, {}),

    getDashboardStats: async (user: User): WorkflowResult<DashboardStats> => {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)

      const [totalLists, recentLists, pendingItems, completedToday] =
        await Promise.all([
          lists.count({ userId: user.id }),
          lists.count({ userId: user.id, since: sevenDaysAgo() }),
          items.count({ userId: user.id, status: "pending" }),
          items.count({
            userId: user.id,
            status: "bought",
            updatedSince: startOfToday,
          }),
        ])

      return Result.ok({
        totalLists,
        recentLists,
        pendingItems,
        completedToday,
      })
    },

    updateGroceryList: (
      id: GroceryList["id"],
      body: GroceryListUpdateData,
      user: User,
    ): WorkflowResult<GroceryListDetails> =>
      Result.gen(async function* () {
        const list = yield* Result.await(lists.findById(id))
        const updated = yield* GroceryListEntity.update(list, body, user)
        const saved = yield* Result.await(lists.update(updated))
        const listItems = yield* Result.await(items.findByList(saved))

        return GroceryListService.details(saved, user, listItems)
      }),

    deleteGroceryList: (
      id: GroceryList["id"],
      user: User,
    ): WorkflowResult<{ id: GroceryList["id"] }> =>
      Result.gen(async function* () {
        const list = yield* Result.await(lists.findById(id))
        yield* GroceryListEntity.ensureOwner(list, user)
        yield* Result.await(lists.delete(list.id))

        return Result.ok({ id })
      }),
  }
}

export type GroceryListWorkflows = ReturnType<typeof createGroceryListWorkflows>
