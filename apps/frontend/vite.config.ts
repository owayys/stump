import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { z } from "zod"

const EnvSchema = z.object({ VITE_SERVER_URL: z.url() })

export default defineConfig(({ mode }) => {
  const env = EnvSchema.safeParse(loadEnv(mode, process.cwd(), "VITE_"))
  if (!env.success) {
    throw new Error(
      `Invalid frontend env (see .env.example):\n${z.prettifyError(env.error)}`,
    )
  }

  return {
    css: { transformer: "lightningcss" },
    resolve: { tsconfigPaths: true },
    server: {
      cors: mode === "development",
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: mode === "development" ? true : undefined,
    },
    // tanstackStart must precede viteReact
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  }
})
