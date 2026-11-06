import { z } from "zod"

const FieldError = z.union([
  z.string(),
  z.object({ message: z.string() }).transform(({ message }) => message),
])

export const formatFieldErrors = (errors: ReadonlyArray<unknown>) =>
  errors.flatMap((err) => FieldError.safeParse(err).data || []).join(", ")
