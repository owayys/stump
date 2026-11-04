import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { authClient, getSession } from "@/shared/auth-client"

export const sessionQueryOptions = queryOptions({
  queryKey: ["auth", "session"],
  queryFn: getSession,
})

type LoginData = { email: string; password: string }
type RegisterData = LoginData & { name: string }

// Cached data belongs to the previous user, so it is cleared whenever the user changes
export const useLoginMutation = (redirectTo = "/") => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginData) =>
      authClient.signIn.email({ ...data, rememberMe: true }),
    onSuccess: async (res) => {
      if (res.error) {
        toast.error("Login failed", { description: res.error.message })
        return
      }
      queryClient.clear()
      toast.success("Login successful")
      await navigate({ href: redirectTo, replace: true })
    },
    onError: (err) => toast.error("Login failed", { description: err.message }),
  })
}

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterData) => authClient.signUp.email(data),
    onSuccess: async (res) => {
      if (res.error) {
        toast.error("Registration failed", { description: res.error.message })
        return
      }
      queryClient.clear()
      toast.success("Registration successful")
      await navigate({ to: "/", replace: true })
    },
    onError: (err) =>
      toast.error("Registration failed", { description: err.message }),
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authClient.signOut(),
    onSuccess: async (res) => {
      if (res.error) {
        toast.error("Logout failed", { description: res.error.message })
        return
      }
      // Before navigating, or the public layout redirects back to the dashboard
      queryClient.setQueryData(sessionQueryOptions.queryKey, null)
      await navigate({ to: "/auth/login", replace: true })
      queryClient.clear()
      toast.success("Logged out successfully")
    },
    onError: (err) =>
      toast.error("Logout failed", { description: err.message }),
  })
}
