import { Outlet } from "@tanstack/react-router"

export const PublicPageLayout = () => (
  <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
    <Outlet />
  </main>
)
