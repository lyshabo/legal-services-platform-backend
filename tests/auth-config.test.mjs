import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createOidcProvider } from "../auth.config.mjs";

test("OIDC provider is created only from complete approved environment configuration", () => {
  assert.equal(createOidcProvider({}), null);
  const provider = createOidcProvider({
    OIDC_ISSUER: "https://identity.example.test",
    OIDC_CLIENT_ID: "legal-services-platform",
    OIDC_CLIENT_SECRET: "test-secret",
    OIDC_PROVIDER_NAME: "Approved identity"
  });
  assert.equal(provider.type, "oidc");
  assert.equal(provider.issuer, "https://identity.example.test");
  assert.deepEqual(provider.checks, ["pkce", "state", "nonce"]);
  assert.equal(provider.profile({ sub: "user-1", email: "user@example.test" }).role, "PUBLIC_USER");
});

test("development authentication is rejected outside development", () => {
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [
          "--input-type=module",
          "--eval",
          "import('./server-auth.mjs').then((module) => module.assertAuthenticationConfiguration())"
        ],
        {
          cwd: process.cwd(),
          env: { ...process.env, APP_ENV: "production", AUTH_ADAPTER: "dev" },
          stdio: "pipe"
        }
      ),
    /AUTH_ADAPTER=dev is prohibited/
  );
});
