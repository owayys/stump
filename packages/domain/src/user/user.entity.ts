import { entityTimestamps } from "@repo/domain/utils/entity"
import { invalid, type Validation } from "@repo/domain/utils/errors"
import { Result } from "better-result"
import { z } from "zod"

export const UserId = z.uuid().brand<"UserId">()

export const UserSchema = z.object({
  id: UserId,
  ...entityTimestamps,
  name: z.string().min(1),
  email: z.string().min(1).brand<"Email">(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
})
export type User = z.output<typeof UserSchema>

export const UserEntity = {
  parse(data: unknown): Result<User, Validation> {
    const parsed = UserSchema.safeParse(data)

    return parsed.success
      ? Result.ok(parsed.data)
      : Result.err(
          invalid(
            parsed.error.issues.map((issue) => ({
              message: issue.message,
              field: issue.path.join("."),
            })),
          ),
        )
  },
}
