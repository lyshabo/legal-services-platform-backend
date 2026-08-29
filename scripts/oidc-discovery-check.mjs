if (!process.env.OIDC_ISSUER) {
  console.error("OIDC_ISSUER is required for discovery verification.");
  process.exitCode = 2;
  process.exit();
}

const issuer = new URL(process.env.OIDC_ISSUER);
const discoveryUrl = new URL(
  `${issuer.pathname.replace(/\/$/, "")}/.well-known/openid-configuration`,
  issuer.origin
);
const response = await fetch(discoveryUrl, {
  headers: { accept: "application/json" },
  redirect: "error",
  signal: AbortSignal.timeout(15000)
});

if (!response.ok) {
  throw new Error(`OIDC discovery returned HTTP ${response.status}.`);
}

const metadata = await response.json();
const expectedIssuer = issuer.href.replace(/\/$/, "");
const discoveredIssuer = new URL(metadata.issuer).href.replace(/\/$/, "");
if (discoveredIssuer !== expectedIssuer) {
  throw new Error("OIDC discovery issuer does not match the approved issuer.");
}
for (const name of ["authorization_endpoint", "token_endpoint", "jwks_uri"]) {
  const endpoint = new URL(metadata[name]);
  if (endpoint.protocol !== "https:") {
    throw new Error(`OIDC discovery field ${name} must use HTTPS.`);
  }
}

console.log("Approved OIDC discovery metadata passed issuer and HTTPS checks.");
