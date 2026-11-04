import { authenticated } from "@/web/orpc"

const base = authenticated.user

export default base.router({
  whoami: base.whoami.handler(({ context }) => context.user),
})
