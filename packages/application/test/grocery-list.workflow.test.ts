import { createGroceryListWorkflows } from "@repo/application/workflows/grocery-list.workflow"
import { notFound } from "@repo/domain"
import type { GroceryList } from "@repo/domain/grocery-list/grocery-list.entity"
import type { GroceryListRepository } from "@repo/domain/grocery-list/grocery-list.repository"
import type { Item } from "@repo/domain/grocery-list-item/item.entity"
import type { ItemRepository } from "@repo/domain/grocery-list-item/item.repository"
import type { User } from "@repo/domain/user/user.entity"
import { Result } from "better-result"
import { beforeEach, describe, expect, it } from "vitest"

const now = new Date("2026-01-01T00:00:00Z")
const makeUser = (id: string): User => ({
  id: id as User["id"],
  createdAt: now,
  updatedAt: now,
  name: "User",
  email: "user@dev.com" as User["email"],
  emailVerified: true,
  image: null,
})

const owner = makeUser("5f980952-d2f6-4632-9041-15a4221a0068")
const stranger = makeUser("6a980952-d2f6-4632-9041-15a4221a0069")

const createFakes = () => {
  const lists = new Map<string, GroceryList>()
  const items: Item[] = []

  const listRepo: GroceryListRepository = {
    create: async (list, newItems) => {
      lists.set(list.id, list)
      items.push(...newItems)
      return Result.ok(list)
    },
    findById: async (id) => {
      const list = lists.get(id)
      return list ? Result.ok(list) : Result.err(notFound("GroceryList", id))
    },
    update: async (list) => {
      lists.set(list.id, list)
      return Result.ok(list)
    },
    delete: async (id) =>
      lists.delete(id) ? Result.ok() : Result.err(notFound("GroceryList", id)),
    findByUserId: async () => Result.ok([...lists.values()]),
    findWithFilters: async () =>
      Result.ok({
        items: [...lists.values()],
        totalCount: lists.size,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      }),
    count: async () => lists.size,
  }

  const itemRepo: ItemRepository = {
    create: async (item) => Result.ok(item),
    findByList: async (list) =>
      Result.ok(items.filter((item) => item.listId === list.id)),
    update: async (item) => Result.ok(item),
    delete: async (id) => Result.err(notFound("Item", id)),
    deleteByList: async () => Result.ok([]),
    count: async () => items.length,
  }

  return {
    flows: createGroceryListWorkflows({ lists: listRepo, items: itemRepo }),
  }
}

describe("grocery list workflows", () => {
  let flows: ReturnType<typeof createFakes>["flows"]
  let listId: GroceryList["id"]

  beforeEach(async () => {
    flows = createFakes().flows
    const created = await flows.createGroceryList(
      {
        name: "Weekly",
        description: "d",
        items: [{ name: "Milk", quantity: 2, notes: null }],
      },
      owner,
    )
    listId = created.unwrap().id
  })

  it("creates a list and returns its details with stats", async () => {
    const details = (
      await flows.fetchGroceryListDetails(listId, owner)
    ).unwrap()

    expect(details.name).toBe("Weekly")
    expect(details.items).toHaveLength(1)
    expect(details.stats.totalItems).toBe(1)
    expect(details.owner.id).toBe(owner.id)
  })

  it("refuses other users with a Forbidden error", async () => {
    const result = await flows.fetchGroceryListDetails(listId, stranger)

    expect(result.isErr() && result.error._tag).toBe("Forbidden")
  })

  it("reports missing lists as NotFound", async () => {
    const missingId =
      "9c6beb2c-bebd-4d58-8664-5e9fe93c659c" as GroceryList["id"]
    const result = await flows.fetchGroceryListDetails(missingId, owner)

    expect(result.isErr() && result.error._tag).toBe("NotFound")
  })

  it("lets only the owner update a list", async () => {
    const updated = await flows.updateGroceryList(
      listId,
      { name: "Renamed", active: true },
      owner,
    )
    expect(updated.unwrap().name).toBe("Renamed")

    const denied = await flows.updateGroceryList(
      listId,
      { name: "Other" },
      stranger,
    )
    expect(denied.isErr() && denied.error._tag).toBe("Forbidden")
  })

  it("deletes only the owner's lists", async () => {
    const denied = await flows.deleteGroceryList(listId, stranger)
    expect(denied.isErr() && denied.error._tag).toBe("Forbidden")

    expect((await flows.deleteGroceryList(listId, owner)).unwrap()).toEqual({
      id: listId,
    })
  })
})
