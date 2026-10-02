import { spawn } from "node:child_process";
const children = [
  "apps/web/node_modules/vite/bin/vite.js",
  "node_modules/next/dist/bin/next",
];
import { existsSync } from "node:fs";
if (existsSync(".env")) process.loadEnvFile(".env");
children[0] = existsSync(children[0])
  ? children[0]
  : "node_modules/vite/bin/vite.js";
const web = spawn(
  process.execPath,
  [children[0], "apps/web", "--host", "127.0.0.1"],
  { stdio: "inherit" },
);
const api = spawn(
  process.execPath,
  [children[1], "dev", "apps/api", "-p", "3001"],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    web.kill();
    api.kill();
  });
