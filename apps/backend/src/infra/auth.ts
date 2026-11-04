import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2"
import { NewUserSchema } from "@repo/contract/schemas/user"
import { type User, UserEntity } from "@repo/domain/user/user.entity"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { openAPI } from "better-auth/plugins"
import { z } from "zod"
import { CORS_TRUSTED_ORIGINS, env } from "@/config"
import type { AppDatabase } from "./db/conn"
import * as authSchema from "./db/models/auth.model"

const beforeHooks = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-up/email") {
    const validationResult = NewUserSchema.safeParse(ctx.body)

    if (!validationResult.success) {
      throw new APIError("UNPROCESSABLE_ENTITY", {
        code: "INPUT_VALIDATION_FAILED",
        message: "Input validation failed",
        data: z.flattenError(validationResult.error),
      })
    }
  }
})

export const createAuth = (db: AppDatabase) =>
  betterAuth({
    basePath: "/auth",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
    emailAndPassword: {
      enabled: true,
      password: {
        hash: (password) => argonHash(password),
        verify: ({ password, hash }) => argonVerify(hash, password),
      },
    },
    appName: env.APP_NAME,
    trustedOrigins: CORS_TRUSTED_ORIGINS,
    plugins: [openAPI({ disableDefaultReference: true })],
    session: {
      cookieCache: { enabled: true, maxAge: 60 * 5 },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    advanced: {
      database: { generateId: false },
    },
    hooks: {
      before: beforeHooks,
    },
  })

export type Auth = ReturnType<typeof createAuth>

export const getSessionUser = async (
  auth: Auth,
  headers: Headers,
): Promise<User | null> => {
  const session = await auth.api.getSession({ headers })
  if (!session?.user) return null

  const user = UserEntity.parse({
    ...session.user,
    image: session.user.image ?? null,
  })

  return user.isOk() ? user.value : null
}
