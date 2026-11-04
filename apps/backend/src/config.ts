import { existsSync } from "node:fs"
import { z } from "zod"

if (existsSync(".env")) process.loadEnvFile()

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "testing"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  APP_NAME: z.string().default("Stump"),
  TRUSTED_ORIGIN: z.url().default("http://localhost:3000"),
  DB_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  DOCS_AUTH_PASS: z.string().min(1),
})

export const env = EnvSchema.parse(process.env)

export const CORS_TRUSTED_ORIGINS = [
  env.TRUSTED_ORIGIN,
  ...(env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
]
