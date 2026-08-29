const required = [
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "VERCEL_PROJECT_ID",
  "DATABASE_URL",
  "DIRECT_URL",
  "AUTH_SECRET",
  "AUTH_URL",
  "OIDC_ISSUER",
  "OIDC_CLIENT_ID",
  "OIDC_CLIENT_SECRET"
];

const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Missing approved configuration: ${missing.join(", ")}`);
  process.exitCode = 2;
  process.exit();
}

function requireRemoteTlsUrl(name, allowedProtocols) {
  const value = process.env[name];
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${name} is not a valid URL.`);
  }
  if (!allowedProtocols.includes(parsed.protocol)) {
    throw new Error(`${name} must use an approved TLS protocol.`);
  }
  if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(`${name} must not target a local host.`);
  }
  if (allowedProtocols.includes("postgresql:") || allowedProtocols.includes("postgres:")) {
    const sslMode = parsed.searchParams.get("sslmode")?.toLowerCase();
    if (!["require", "verify-ca", "verify-full"].includes(sslMode)) {
      throw new Error(`${name} must explicitly require TLS with sslmode.`);
    }
  }
  return parsed;
}

const databaseUrl = requireRemoteTlsUrl("DATABASE_URL", ["postgres:", "postgresql:"]);
const directUrl = requireRemoteTlsUrl("DIRECT_URL", ["postgres:", "postgresql:"]);
requireRemoteTlsUrl("AUTH_URL", ["https:"]);
requireRemoteTlsUrl("OIDC_ISSUER", ["https:"]);

if (process.env.AUTH_SECRET.length < 32) {
  throw new Error("AUTH_SECRET must contain at least 32 characters.");
}
if (databaseUrl.href === directUrl.href) {
  throw new Error("DATABASE_URL and DIRECT_URL must use separate approved connection endpoints.");
}

console.log("Approved live configuration passed non-disclosing structural checks.");
