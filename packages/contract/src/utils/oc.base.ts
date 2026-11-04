import { oc } from "@orpc/contract"
import { COMMON_ERROR_STATUS_MAP } from "@orpc/openapi"
import { z } from "zod"

const inputErrorSchema = z.object({
  formErrors: z.array(z.string()),
  fieldErrors: z.record(z.string(), z.array(z.string())),
})

export const appPublicBase = oc.errors({
  INPUT_VALIDATION_FAILED: {
    message: "Input validation failed",
    data: inputErrorSchema,
  },
})

export const appAuthenticatedBase = appPublicBase.errors({
  NotAuthenticated: {
    message: "No associated user or session",
  },
})

export const ERROR_STATUS_MAP = {
  ...COMMON_ERROR_STATUS_MAP,
  INPUT_VALIDATION_FAILED: 422,
  OUTPUT_VALIDATION_FAILED: 500,
  NotAuthenticated: 401,
} as const
