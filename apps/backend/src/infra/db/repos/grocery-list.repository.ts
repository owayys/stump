import { notFound } from "@repo/domain"
import type {
  GroceryListFindFilters,
  GroceryListRepository,
} from "@repo/domain/grocery-list/grocery-list.repository"
import { PaginationUtils } from "@repo/domain/utils/pagination.utils"
import { Result } from "better-result"
import { and, asc, desc, eq, gte, ilike } from "drizzle-orm"
import type { AppDatabase } from "@/infra/db/conn"
import { buildFilterConditions } from "@/infra/db/db.utils"
import { groceryListItems, groceryLists } from "@/infra/db/schema"

const buildFindFilters = (filters: GroceryListFindFilters) => {
  const conditions = buildFilterConditions(filters, {
    userId: (id) => eq(groceryLists.ownerId, id),
    search: (search) => ilike(groceryLists.name, `%${search}%`),
    status: (s) => eq(groceryLists.active, s === "active"),
    since: (d) => gte(groceryLists.updatedAt, d),
  })

  return conditions.length > 0 ? and(...conditions) : undefined
}

export const createGroceryListRepository = (
  db: AppDatabase,
): GroceryListRepository => ({
  async create(list, items) {
    await db.transaction(async (tx) => {
      await tx.insert(groceryLists).values(list)
      if (items.length > 0) await tx.insert(groceryListItems).values(items)
    })

    return Result.ok(list)
  },

  async findById(id) {
    try {
      const row = await db.query.groceryLists.findFirst({
        where: eq(groceryLists.id, id),
      })

      return row ? Result.ok(row) : Result.err(notFound("GroceryList", id))
    } catch {
      return Result.err(notFound("GroceryList", id))
    }
  },

  async update({ id, name, description, active, updatedAt }) {
    const [row] = await db
      .update(groceryLists)
      .set({ name, description, active, updatedAt })
      .where(eq(groceryLists.id, id))
      .returning()

    return row ? Result.ok(row) : Result.err(notFound("GroceryList", id))
  },

  async delete(id) {
    const deleted = await db.transaction(async (tx) => {
      await tx.delete(groceryListItems).where(eq(groceryListItems.listId, id))
      return await tx
        .delete(groceryLists)
        .where(eq(groceryLists.id, id))
        .returning({ id: groceryLists.id })
    })

    return deleted.length > 0
      ? Result.ok(undefined)
      : Result.err(notFound("GroceryList", id))
  },

  async findByUserId(userId) {
    return Result.ok(
      await db
        .select()
        .from(groceryLists)
        .where(eq(groceryLists.ownerId, userId))
        .orderBy(desc(groceryLists.updatedAt)),
    )
  },

  async findWithFilters(filters, paginationParams) {
    const pagination = PaginationUtils.getDefaultPagination(paginationParams)
    const where = buildFindFilters(filters)
    const sortColumn =
      paginationParams.sortBy === "name"
        ? groceryLists.name
        : groceryLists.updatedAt

    const totalCount = await db.$count(groceryLists, where)
    const rows = await db
      .select()
      .from(groceryLists)
      .where(where)
      .orderBy(
        pagination.sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
      )
      .limit(pagination.limit)
      .offset(
        PaginationUtils.calculateOffset(pagination.page, pagination.limit),
      )

    return Result.ok(
      PaginationUtils.createPaginatedResult(
        rows,
        totalCount,
        pagination.page,
        pagination.limit,
      ),
    )
  },

  count: (filters) => db.$count(groceryLists, buildFindFilters(filters)),
})
