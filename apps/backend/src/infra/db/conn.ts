import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "@/config"
import * as schema from "./schema"

export const createDb = (url = env.DB_URL) =>
  drizzle({
    client: postgres(url, {
      max: 25,
      idle_timeout: 60,
    }),
    schema,
    logger: env.NODE_ENV === "development",
  })

export type AppDatabase = ReturnType<typeof createDb>
