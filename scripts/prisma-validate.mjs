import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for Prisma validation; no placeholder or localhost fallback is permitted.");
  process.exitCode = 2;
  process.exit();
}

const env = { ...process.env };

const prismaCli = new URL("../node_modules/prisma/build/index.js", import.meta.url);
const result = spawnSync(process.execPath, [prismaCli.pathname.replace(/^\/([A-Za-z]:)/, "$1"), "validate"], {
  stdio: "inherit",
  env
});

process.exitCode = result.status ?? 1;
