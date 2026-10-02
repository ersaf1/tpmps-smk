import { existsSync } from "node:fs";
if (existsSync(".env")) process.loadEnvFile(".env");
process.argv = [process.execPath, "next", "dev", "apps/api", "-p", "3001"];
await import("../node_modules/next/dist/bin/next");
