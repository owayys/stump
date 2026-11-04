import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/web/server.ts"],
  format: "esm",
  platform: "node",
  outDir: "dist",
  fixedExtension: false,
  deps: {
    alwaysBundle: [/^@repo\//],
    onlyBundle: false,
  },
})
