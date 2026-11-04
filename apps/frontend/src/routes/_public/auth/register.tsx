import { createFileRoute } from "@tanstack/react-router"
import RegisterForm from "@/components/auth/RegisterForm"

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterForm,
})
