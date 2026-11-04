import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { showRoutes } from "hono/dev"
import { logger } from "hono/logger"
import { CORS_TRUSTED_ORIGINS, env } from "@/config"
import { createDeps } from "@/deps"
import { mountHandlers } from "./handlers"

const app = new Hono()
app.use(logger())
app.use("/*", cors({ origin: CORS_TRUSTED_ORIGINS, credentials: true }))

await mountHandlers(app, createDeps())

if (env.NODE_ENV === "development") {
  showRoutes(app, { verbose: true })
}

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`)
})
