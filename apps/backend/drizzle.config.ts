import { defineConfig } from "drizzle-kit"
import { env } from "./src/config"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infra/db/schema.ts",
  out: "./migrations",
  dbCredentials: { url: env.DB_URL },
})
