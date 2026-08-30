import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createOidcProvider } from "../auth.config.mjs";
import {
  createDevSession,
  getSession,
  parseCookies,
  sessionCookie
} from "../server-auth.mjs";

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

test("development authentication requires an explicit strong secret", () => {
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
          env: {
            ...process.env,
            APP_ENV: "development",
            AUTH_ADAPTER: "dev",
            DEV_ADMIN_KEY: ""
          },
          stdio: "pipe"
        }
      ),
    /DEV_ADMIN_KEY must be supplied/
  );
});

test("development sessions expire server-side and cookie parsing preserves encoded values", async () => {
  assert.equal(parseCookies("token=a%3Db%3Dc").token, "a=b=c");
  const session = createDevSession();
  const cookie = sessionCookie(session).split(";")[0];
  assert.equal((await getSession({ headers: { cookie } }))?.id, session.id);
  session.expiresAt = new Date(Date.now() - 1).toISOString();
  assert.equal(await getSession({ headers: { cookie } }), null);
});
