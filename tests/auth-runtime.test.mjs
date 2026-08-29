import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { generateKeyPairSync, sign } from "node:crypto";
import { Auth } from "@auth/core";
import { decode as decodeAuthToken } from "@auth/core/jwt";
import { buildAuthConfig } from "../auth.config.mjs";
import { sessionHasRole } from "../server-auth.mjs";

function createMemoryAdapter() {
  const users = new Map();
  const accounts = new Map();
  const sessions = new Map();
  return {
    users,
    accounts,
    sessions,
    async createUser(user) {
      const stored = { id: `user-${users.size + 1}`, role: "PUBLIC_USER", ...user };
      users.set(stored.id, stored);
      return stored;
    },
    async getUser(id) {
      return users.get(id) ?? null;
    },
    async getUserByEmail(email) {
      return [...users.values()].find((user) => user.email === email) ?? null;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = accounts.get(`${provider}:${providerAccountId}`);
      return account ? users.get(account.userId) ?? null : null;
    },
    async updateUser(user) {
      const stored = { ...users.get(user.id), ...user };
      users.set(user.id, stored);
      return stored;
    },
    async linkAccount(account) {
      accounts.set(`${account.provider}:${account.providerAccountId}`, account);
      return account;
    },
    async createSession(session) {
      sessions.set(session.sessionToken, session);
      return session;
    },
    async getSessionAndUser(sessionToken) {
      const session = sessions.get(sessionToken);
      return session ? { session, user: users.get(session.userId) } : null;
    },
    async updateSession(session) {
      const stored = { ...sessions.get(session.sessionToken), ...session };
      sessions.set(session.sessionToken, stored);
      return stored;
    },
    async deleteSession(sessionToken) {
      const stored = sessions.get(sessionToken) ?? null;
      sessions.delete(sessionToken);
      return stored;
    }
  };
}

function mergeCookies(jar, response) {
  for (const cookie of response.headers.getSetCookie()) {
    const [nameValue] = cookie.split(";");
    const separator = nameValue.indexOf("=");
    jar.set(nameValue.slice(0, separator), nameValue.slice(separator + 1));
  }
}

function cookieHeader(jar) {
  return [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
}

function jwt(privateKey, kid, claims) {
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT", kid })).toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const signature = sign("RSA-SHA256", Buffer.from(`${header}.${payload}`), privateKey).toString(
    "base64url"
  );
  return `${header}.${payload}.${signature}`;
}

test("Auth.js completes an OIDC callback, persists the session, and preserves RBAC", async (context) => {
  const adapter = createMemoryAdapter();
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const kid = "test-key";
  const publicJwk = publicKey.export({ format: "jwk" });
  let expectedNonce;
  let issuer;

  const identityServer = createServer(async (request, response) => {
    const url = new URL(request.url, issuer);
    if (url.pathname === "/.well-known/openid-configuration") {
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          issuer,
          authorization_endpoint: `${issuer}/authorize`,
          token_endpoint: `${issuer}/token`,
          userinfo_endpoint: `${issuer}/userinfo`,
          jwks_uri: `${issuer}/jwks`,
          response_types_supported: ["code"],
          subject_types_supported: ["public"],
          id_token_signing_alg_values_supported: ["RS256"],
          token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
          code_challenge_methods_supported: ["S256"]
        })
      );
      return;
    }
    if (url.pathname === "/jwks") {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ keys: [{ ...publicJwk, kid, use: "sig", alg: "RS256" }] }));
      return;
    }
    if (url.pathname === "/token") {
      const now = Math.floor(Date.now() / 1000);
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          access_token: "access-token",
          token_type: "Bearer",
          expires_in: 300,
          id_token: jwt(privateKey, kid, {
            iss: issuer,
            aud: "legal-services-platform",
            sub: "oidc-user-1",
            email: "admin@example.test",
            email_verified: true,
            name: "OIDC administrator",
            nonce: expectedNonce,
            iat: now,
            exp: now + 300
          })
        })
      );
      return;
    }
    if (url.pathname === "/userinfo") {
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          sub: "oidc-user-1",
          email: "admin@example.test",
          email_verified: true,
          name: "OIDC administrator"
        })
      );
      return;
    }
    response.statusCode = 404;
    response.end();
  });
  await new Promise((resolve) => identityServer.listen(0, "127.0.0.1", resolve));
  context.after(() => new Promise((resolve) => identityServer.close(resolve)));
  issuer = `http://127.0.0.1:${identityServer.address().port}`;

  const config = buildAuthConfig({
    adapter,
    env: {
      AUTH_SECRET: "test-secret-with-at-least-thirty-two-characters",
      OIDC_ISSUER: issuer,
      OIDC_CLIENT_ID: "legal-services-platform",
      OIDC_CLIENT_SECRET: "client-secret"
    }
  });
  const origin = "http://app.example.test";
  const cookies = new Map();

  const csrfResponse = await Auth(new Request(`${origin}/api/auth/csrf`), config);
  assert.equal(csrfResponse.status, 200);
  mergeCookies(cookies, csrfResponse);
  const { csrfToken } = await csrfResponse.json();

  const signInResponse = await Auth(
    new Request(`${origin}/api/auth/signin/approved-oidc`, {
      method: "POST",
      headers: {
        cookie: cookieHeader(cookies),
        "content-type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ csrfToken, callbackUrl: `${origin}/#/admin` })
    }),
    config
  );
  assert.equal(signInResponse.status, 302);
  mergeCookies(cookies, signInResponse);
  const authorizationUrl = new URL(signInResponse.headers.get("location"));
  const nonceCookieName = cookies.has("authjs.nonce")
    ? "authjs.nonce"
    : "__Secure-authjs.nonce";
  const nonceCookie = cookies.get(nonceCookieName);
  const noncePayload = await decodeAuthToken({
    token: nonceCookie,
    salt: nonceCookieName,
    secret: "test-secret-with-at-least-thirty-two-characters"
  });
  expectedNonce = noncePayload?.value ?? authorizationUrl.searchParams.get("nonce");
  assert.ok(expectedNonce);

  const callbackResponse = await Auth(
    new Request(
      `${origin}/api/auth/callback/approved-oidc?code=approved-code&state=${encodeURIComponent(
        authorizationUrl.searchParams.get("state")
      )}`,
      { headers: { cookie: cookieHeader(cookies) } }
    ),
    config
  );
  assert.equal(callbackResponse.status, 302);
  mergeCookies(cookies, callbackResponse);
  assert.equal(adapter.accounts.size, 1);
  assert.equal(adapter.sessions.size, 1);

  const user = [...adapter.users.values()][0];
  user.role = "PLATFORM_ADMIN";
  adapter.users.set(user.id, user);

  const sessionResponse = await Auth(
    new Request(`${origin}/api/auth/session`, { headers: { cookie: cookieHeader(cookies) } }),
    config
  );
  assert.equal(sessionResponse.status, 200);
  const session = await sessionResponse.json();
  assert.equal(session.user.id, user.id);
  assert.equal(session.user.role, "PLATFORM_ADMIN");
  assert.equal(sessionHasRole(session, "PLATFORM_ADMIN"), true);
  assert.equal(sessionHasRole(session, "PRIVACY_ADMIN"), false);
});
