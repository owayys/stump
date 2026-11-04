import type { User } from "@repo/domain/user/user.entity"

const now = new Date("2026-01-01T00:00:00Z")

export const makeUser = (id: string): User => ({
  id: id as User["id"],
  createdAt: now,
  updatedAt: now,
  name: "User",
  email: "user@dev.com" as User["email"],
  emailVerified: true,
  image: null,
})

export const owner = makeUser("5f980952-d2f6-4632-9041-15a4221a0068")
export const stranger = makeUser("6a980952-d2f6-4632-9041-15a4221a0069")
