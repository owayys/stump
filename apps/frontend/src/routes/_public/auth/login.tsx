import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import LoginForm from "@/components/auth/LoginForm"

// Same-app paths only; browsers treat "//x" and "/\x" as other hosts
const appPath = z
  .string()
  .regex(/^\/(?![/\\])/)
  .optional()
  .catch(undefined)

export const Route = createFileRoute("/_public/auth/login")({
  component: LoginForm,
  head: () => ({ meta: [{ title: "Login to Stump" }] }),
  validateSearch: z.object({ redirect: appPath }),
})
