import { implement, ORPCError, ValidationError } from "@orpc/server"
import type { ResponseHeadersHandlerPluginContext } from "@orpc/server/plugins"
import { CONTRACT } from "@repo/contract/contracts"
import type { DomainError } from "@repo/domain"
import type { Result } from "better-result"
import { z } from "zod"
import type { Deps } from "@/deps"
import { getSessionUser } from "@/infra/auth"

export type AppContext = ResponseHeadersHandlerPluginContext & {
  headers: Headers
  deps: Deps
}

export const authenticated = implement(CONTRACT.authenticated)
  .$context<AppContext>()
  .use(async ({ context, next, errors }) => {
    const user = await getSessionUser(context.deps.auth, context.headers)
    if (!user) throw errors.NotAuthenticated()

    return next({ context: { user } })
  })

const ERROR_CODES = {
  NotFound: "NOT_FOUND",
  Forbidden: "FORBIDDEN",
  Validation: "UNPROCESSABLE_CONTENT",
  Conflict: "CONFLICT",
} as const satisfies Record<DomainError["_tag"], string>

export const unwrap = <T>(result: Result<T, DomainError>): T => {
  if (result.isErr()) {
    throw new ORPCError(ERROR_CODES[result.error._tag], {
      message: result.error.message,
      cause: result.error,
    })
  }

  return result.value
}

export const validationErrMap = (err: unknown) => {
  if (!(err instanceof ORPCError) || !(err.cause instanceof ValidationError)) {
    console.error(err)
    throw err
  }

  if (err.code === "BAD_REQUEST") {
    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      cause: err.cause,
      message: "Input validation failed",
      data: z.flattenError(
        new z.ZodError(err.cause.issues as z.core.$ZodIssue[]),
      ),
    })
  }

  throw new ORPCError("OUTPUT_VALIDATION_FAILED", { cause: err.cause })
}
