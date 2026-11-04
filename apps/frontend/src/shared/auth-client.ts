import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  basePath: "/auth",
  fetchOptions: { credentials: "include" },
})

export const forwardedCookie = createIsomorphicFn()
  .server((): Record<string, string> => {
    const cookie = getRequestHeader("cookie")
    return cookie ? { cookie } : {}
  })
  .client((): Record<string, string> => ({}))

export const getSession = async () => {
  const res = await authClient.getSession({
    fetchOptions: { headers: forwardedCookie() },
  })
  return res.data
}

export type AppSession = typeof authClient.$Infer.Session
