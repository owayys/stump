import { z } from "zod"

export const entityTimestamps = {
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const newEntityFields = <Id extends string>() => {
  const now = new Date()

  return { id: crypto.randomUUID() as Id, createdAt: now, updatedAt: now }
}
