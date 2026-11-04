import { revalidateLogic } from "@tanstack/react-form"
import { getRouteApi, Link } from "@tanstack/react-router"
import { useAppForm } from "@/shared/hooks/app-form"
import { useLoginMutation } from "@/shared/hooks/auth-hooks"
import { loginFormSchema } from "@/shared/schemas/auth"
import { AuthCard } from "./AuthCard"

const loginRoute = getRouteApi("/_public/auth/login")

const LoginForm = () => {
  const redirectTo = loginRoute.useSearch({ select: (s) => s.redirect })
  const loginMut = useLoginMutation(redirectTo)

  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: loginFormSchema },

    onSubmit: async ({ value }) => {
      await loginMut.mutateAsync(value)
    },
  })

  const authPending = form.state.isSubmitting

  return (
    <AuthCard
      description={
        <>
          Don't have an account yet?{" "}
          <Link
            className="text-primary underline"
            preload="intent"
            to="/auth/register"
          >
            Sign Up
          </Link>
        </>
      }
      title="Login to Stump"
    >
      <form
        className="grid gap-4"
        method="post"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppForm>
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                disabled={authPending}
                label="Email"
                placeholder="your@email.com"
                required
                type="email"
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.TextField
                disabled={authPending}
                label="Password"
                placeholder="Your password"
                required
                type="password"
              />
            )}
          </form.AppField>
          <form.SubmitButton fullWidth label="Login" />
        </form.AppForm>
      </form>
    </AuthCard>
  )
}

export default LoginForm
