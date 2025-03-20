import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm"],
    target: "es2022",
    external: ["dotenv"],
    splitting: false,
    sourcemap: true,
    dts: true,
    shims: true
});