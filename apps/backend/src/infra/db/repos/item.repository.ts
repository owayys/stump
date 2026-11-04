import { invalid, notFound } from "@repo/domain"
import type { ItemRepository } from "@repo/domain/grocery-list-item/item.repository"
import { Result } from "better-result"
import { and, eq, gte, type SQL } from "drizzle-orm"
import type { AppDatabase } from "@/infra/db/conn"
import { groceryListItems } from "@/infra/db/schema"

export const createItemRepository = (db: AppDatabase): ItemRepository => ({
  async create(item) {
    const [row] = await db.insert(groceryListItems).values(item).returning()

    return row
      ? Result.ok(row)
      : Result.err(invalid([{ message: "Failed to create item" }]))
  },

  async findByList(list) {
    return Result.ok(
      await db
        .select()
        .from(groceryListItems)
        .where(eq(groceryListItems.listId, list.id)),
    )
  },

  async update({ id, name, quantity, notes, status, updatedAt }) {
    const [row] = await db
      .update(groceryListItems)
      .set({ name, quantity, notes, status, updatedAt })
      .where(eq(groceryListItems.id, id))
      .returning()

    return row ? Result.ok(row) : Result.err(notFound("Item", id))
  },

  async delete(id) {
    const [row] = await db
      .delete(groceryListItems)
      .where(eq(groceryListItems.id, id))
      .returning()

    return row ? Result.ok(row) : Result.err(notFound("Item", id))
  },

  async deleteByList(list) {
    const rows = await db
      .delete(groceryListItems)
      .where(eq(groceryListItems.listId, list.id))
      .returning({ id: groceryListItems.id })

    return Result.ok(rows.map((r) => r.id))
  },

  count(filters) {
    const conditions: SQL[] = []

    if (filters.listId) {
      conditions.push(eq(groceryListItems.listId, filters.listId))
    }
    if (filters.userId) {
      conditions.push(eq(groceryListItems.createdBy, filters.userId))
    }
    if (filters.status) {
      conditions.push(eq(groceryListItems.status, filters.status))
    }
    if (filters.updatedSince) {
      conditions.push(gte(groceryListItems.updatedAt, filters.updatedSince))
    }

    return db.$count(
      groceryListItems,
      conditions.length > 0 ? and(...conditions) : undefined,
    )
  },
})
