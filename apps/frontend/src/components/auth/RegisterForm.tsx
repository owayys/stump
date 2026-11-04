import { revalidateLogic } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { useAppForm } from "@/shared/hooks/app-form"
import { useRegisterMutation } from "@/shared/hooks/auth-hooks"
import { registerFormSchema } from "@/shared/schemas/auth"
import { AuthCard } from "./AuthCard"

const RegisterForm = () => {
  const registerMut = useRegisterMutation()

  const form = useAppForm({
    defaultValues: { name: "", email: "", password: "" },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: registerFormSchema },

    onSubmit: async ({ value }) => {
      await registerMut.mutateAsync(value)
    },
  })
  const authPending = form.state.isSubmitting

  return (
    <AuthCard
      description={
        <>
          Already have an account?{" "}
          <Link
            className="text-primary underline"
            preload="intent"
            to="/auth/login"
          >
            Sign in
          </Link>
        </>
      }
      title="Create an account"
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
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                disabled={authPending}
                label="Name"
                placeholder="Your name"
                required
              />
            )}
          </form.AppField>
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
          <form.SubmitButton fullWidth label="Create account" />
        </form.AppForm>
      </form>
    </AuthCard>
  )
}

export default RegisterForm
