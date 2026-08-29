import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const publicDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const forbiddenPublicNames = [
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "OIDC_CLIENT_SECRET",
  "DEV_ADMIN_KEY",
  "VERCEL_TOKEN",
  "CLAUDE_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET"
];
const credentialPatterns = [
  /postgres(?:ql)?:\/\/[^<\s]+/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}\b/,
  /\bwhsec_[A-Za-z0-9]{16,}\b/
];

const files = await readdir(publicDirectory, { withFileTypes: true });
const findings = [];

for (const entry of files) {
  if (!entry.isFile()) continue;
  const text = await readFile(join(publicDirectory, entry.name), "utf8");
  for (const name of forbiddenPublicNames) {
    if (text.includes(name)) {
      findings.push(`${entry.name}: contains forbidden server-only name ${name}`);
    }
  }
  for (const pattern of credentialPatterns) {
    if (pattern.test(text)) findings.push(`${entry.name}: matches a credential pattern`);
  }
}

if (findings.length) {
  for (const finding of findings) console.error(finding);
  process.exitCode = 1;
} else {
  console.log("Public build contains no audited server-only secret names or credential patterns.");
}
