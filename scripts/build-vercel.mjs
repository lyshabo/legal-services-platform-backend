import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const output = join(root, "dist");
const publicFiles = [
  "index.html",
  "app.js",
  "styles.css",
  "data.js",
  "i18n.js",
  "platform-core.js"
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of publicFiles) {
  await cp(join(root, file), join(output, file));
}

console.log(`Prepared ${publicFiles.length} public assets in dist/`);
