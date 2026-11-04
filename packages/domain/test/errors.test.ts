import { invalid, NotFound, notFound } from "@repo/domain/utils/errors"
import { describe, expect, it } from "vitest"

describe("error helpers", () => {
  it("invalid builds a tagged Validation error with a summary message", () => {
    const error = invalid([
      { message: "Issue 1", field: "field1" },
      { message: "Issue 2", field: "field2" },
    ])

    expect(error._tag).toBe("Validation")
    expect(error).toBeInstanceOf(Error)
    expect(error.issues).toHaveLength(2)
    expect(error.message).toBe(
      "Validation failed with 2 error(s): Issue 1, Issue 2",
    )
  })

  it("notFound builds a tagged NotFound error", () => {
    const error = notFound("GroceryList", "123")

    expect(NotFound.is(error)).toBe(true)
    expect(error.resource).toBe("GroceryList")
    expect(error.message).toBe("GroceryList with id '123' not found")
  })
})
