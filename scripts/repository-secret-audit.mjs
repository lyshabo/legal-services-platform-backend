import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const trackedFiles = execFileSync("git", ["ls-files", "-z"], {
  encoding: "utf8"
})
  .split("\0")
  .filter(Boolean);

const retiredDevelopmentKey = ["development", "only", "admin"].join("-");
const credentialPatterns = [
  { name: "PostgreSQL credential URL", pattern: /postgres(?:ql)?:\/\/[^<\s]+/i },
  { name: "OpenAI/AI-style secret key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "GitHub token", pattern: /\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}\b/ },
  { name: "Stripe webhook secret", pattern: /\bwhsec_[A-Za-z0-9]{16,}\b/ },
  {
    name: "weak secret assignment",
    pattern:
      /^(?:AUTH_SECRET|OIDC_CLIENT_SECRET|DEV_ADMIN_KEY|CLAUDE_API_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET)\s*=\s*(?:test|123|changeme|secret)\s*$/im
  },
  {
    name: "retired fixed development key",
    pattern: new RegExp(retiredDevelopmentKey)
  }
];
const findings = [];

for (const file of trackedFiles) {
  let text;
  try {
    text = await readFile(file, "utf8");
  } catch {
    continue;
  }
  for (const { name, pattern } of credentialPatterns) {
    if (pattern.test(text)) findings.push(`${file}: ${name}`);
  }
}

if (findings.length) {
  for (const finding of findings) console.error(finding);
  process.exitCode = 1;
} else {
  console.log("Tracked repository files contain no audited credential patterns or weak secret defaults.");
}
