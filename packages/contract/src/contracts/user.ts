import { type } from "@orpc/contract"
import { openapi } from "@orpc/openapi"
import { appAuthenticatedBase } from "@repo/contract/utils/oc.base"
import { UserSchema } from "@repo/domain/user/user.entity"

const userBase = appAuthenticatedBase

export const whoami = userBase
  .meta(
    openapi({
      method: "GET",
      path: "/user/whoami",
      summary: "Get current user",
      tags: ["user"],
    }),
  )
  .input(type<void>())
  .output(UserSchema)

export default { whoami }
