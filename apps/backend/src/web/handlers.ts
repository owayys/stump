import { OpenAPIGenerator } from "@orpc/openapi"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { OpenAPIReferenceHandlerPlugin } from "@orpc/openapi/plugins"
import { onError } from "@orpc/server"
import { RPCHandler } from "@orpc/server/fetch"
import {
  BatchHandlerPlugin,
  ResponseHeadersHandlerPlugin,
} from "@orpc/server/plugins"
import { ZodToJsonSchemaConverter } from "@orpc/zod"
import { ERROR_STATUS_MAP } from "@repo/contract/contracts"
import type { Hono } from "hono"
import { basicAuth } from "hono/basic-auth"
import { env } from "@/config"
import type { Deps } from "@/deps"
import { type AppContext, validationErrMap } from "./orpc"
import { router } from "./router"

const API_PREFIX = "/api"

export const mountHandlers = async (app: Hono, deps: Deps) => {
  app.on(["GET", "POST"], "/auth/*", (c) => deps.auth.handler(c.req.raw))

  const rpc = new RPCHandler<AppContext>(router, {
    interceptors: [onError(validationErrMap)],
    errorStatusMap: ERROR_STATUS_MAP,
    plugins: [new ResponseHeadersHandlerPlugin(), new BatchHandlerPlugin()],
  })

  const authSpec = await deps.auth.api.generateOpenAPISchema()
  const api = new OpenAPIHandler<AppContext>(router, {
    interceptors: [onError(validationErrMap)],
    errorStatusMap: ERROR_STATUS_MAP,
    plugins: [
      new ResponseHeadersHandlerPlugin(),
      new OpenAPIReferenceHandlerPlugin({
        docsPath: "/docs",
        specPath: "/spec.json",
        spec: () =>
          new OpenAPIGenerator({
            converters: [new ZodToJsonSchemaConverter()],
          }).generate(router, {
            base: {
              info: { title: "Stump API", version: "0.0.0" },
              servers: [{ url: API_PREFIX }],
            },
            errorStatusMap: ERROR_STATUS_MAP,
          }),
        providerConfig: {
          sources: [
            { title: "API", url: `${API_PREFIX}/spec.json` },
            { title: "Auth", content: authSpec },
          ],
        },
      }),
    ],
  })

  app.use(
    `${API_PREFIX}/docs`,
    basicAuth({ username: "docs", password: env.DOCS_AUTH_PASS }),
  )
  app.use(
    `${API_PREFIX}/spec.json`,
    basicAuth({ username: "docs", password: env.DOCS_AUTH_PASS }),
  )

  const handlers = [
    { prefix: "/rpc", handler: rpc },
    { prefix: API_PREFIX, handler: api },
  ] as const

  for (const { prefix, handler } of handlers) {
    app.use(`${prefix}/*`, async (c, next) => {
      const { matched, response } = await handler.handle(c.req.raw, {
        prefix,
        context: { headers: c.req.raw.headers, deps },
      })

      return matched ? c.newResponse(response.body, response) : next()
    })
  }
}
