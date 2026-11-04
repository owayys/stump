import { GroceryListEntity } from "@repo/domain/grocery-list/grocery-list.entity"
import { GroceryListService } from "@repo/domain/grocery-list/grocery-list.service"
import { ItemEntity } from "@repo/domain/grocery-list-item/item.entity"
import { UserEntity } from "@repo/domain/user/user.entity"
import { describe, expect, it } from "vitest"
import { owner, stranger } from "./fixtures"

const newList = () =>
  GroceryListEntity.create({ name: "Weekly", description: "d" }, owner)

describe("GroceryListEntity", () => {
  it("creates an inactive list owned by the creator", () => {
    const list = newList()

    expect(list.ownerId).toBe(owner.id)
    expect(list.active).toBe(false)
    expect(list.id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it("only lets the owner update the list", () => {
    const list = newList()

    const updated = GroceryListEntity.update(list, { name: "Renamed" }, owner)
    expect(updated.unwrap().name).toBe("Renamed")
    expect(updated.unwrap().description).toBe("d")

    const denied = GroceryListEntity.update(list, { name: "x" }, stranger)
    expect(denied.isErr() && denied.error._tag).toBe("Forbidden")
  })
})

describe("ItemEntity", () => {
  it("lets the item creator or the list owner modify it", () => {
    const list = newList()
    const item = ItemEntity.create(
      { name: "Milk", quantity: 2, notes: null },
      list,
      owner,
    )

    expect(ItemEntity.isPending(item)).toBe(true)
    expect(
      ItemEntity.update(item, list, { status: "bought" }, owner).unwrap()
        .status,
    ).toBe("bought")

    const denied = ItemEntity.update(item, list, { name: "Eggs" }, stranger)
    expect(denied.isErr() && denied.error._tag).toBe("Forbidden")
  })

  it("rejects items from another list", () => {
    const item = ItemEntity.create(
      { name: "Milk", quantity: 2, notes: null },
      newList(),
      owner,
    )
    const result = ItemEntity.update(item, newList(), { name: "x" }, owner)

    expect(result.isErr() && result.error._tag).toBe("Validation")
  })
})

describe("GroceryListService", () => {
  it("builds list details with stats, hiding the owner id", () => {
    const { list, items } = GroceryListService.createNewList(
      {
        name: "Weekly",
        description: "d",
        items: [
          { name: "Milk", quantity: 2, notes: null },
          { name: "Eggs", quantity: 12, notes: "free range" },
        ],
      },
      owner,
    )
    const details = GroceryListService.details(list, owner, items).unwrap()

    expect(details.stats).toEqual({
      totalItems: 2,
      pendingItems: 2,
      completedItems: 0,
      completionPercentage: 0,
    })
    expect(details.owner.id).toBe(owner.id)
    expect("ownerId" in details).toBe(false)
  })
})

describe("UserEntity", () => {
  it("parses session data and reports invalid fields", () => {
    expect(UserEntity.parse(owner).unwrap().id).toBe(owner.id)

    const invalid = UserEntity.parse({ ...owner, name: "" })
    expect(invalid.isErr() && invalid.error.issues[0]?.field).toBe("name")
  })
})
