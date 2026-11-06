import { z } from "zod"

export const entityTimestamps = {
  createdAt: z.date(),
  updatedAt: z.date(),
}

export const newEntityFields = <S extends z.ZodType<string, string>>(
  idSchema: S,
) => {
  const now = new Date()

  return {
    id: idSchema.parse(crypto.randomUUID()),
    createdAt: now,
    updatedAt: now,
  }
}
