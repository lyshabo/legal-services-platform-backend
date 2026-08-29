/**
 * Auth.js-compatible configuration contract.
 *
 * The current server uses the explicit local adapter in server-auth.mjs.
 * A Next.js/Auth.js deployment can import this policy and replace only the
 * session transport and provider configuration.
 */
export function createOidcProvider(env = process.env) {
  const required = ["OIDC_ISSUER", "OIDC_CLIENT_ID", "OIDC_CLIENT_SECRET"];
  const missing = required.filter((name) => !env[name]);
  if (missing.length) return null;
  const provider = {
    id: "approved-oidc",
    name: env.OIDC_PROVIDER_NAME || "Organization sign-in",
    type: "oidc",
    issuer: env.OIDC_ISSUER,
    clientId: env.OIDC_CLIENT_ID,
    clientSecret: env.OIDC_CLIENT_SECRET,
    authorization: { params: { scope: "openid profile email" } },
    checks: ["pkce", "state", "nonce"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.preferred_username ?? null,
        email: profile.email ?? null,
        image: profile.picture ?? null,
        role: "PUBLIC_USER"
      };
    }
  };
  if (env.OIDC_AUTHORIZATION_URL) {
    provider.authorization = {
      url: env.OIDC_AUTHORIZATION_URL,
      params: { scope: "openid profile email" }
    };
  }
  if (env.OIDC_TOKEN_URL) provider.token = env.OIDC_TOKEN_URL;
  if (env.OIDC_USERINFO_URL) provider.userinfo = env.OIDC_USERINFO_URL;
  return provider;
}

const oidcProvider = createOidcProvider();

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "database" },
  providers: oidcProvider ? [oidcProvider] : [],
  callbacks: {
    async signIn({ user }) {
      return Boolean(user?.email);
    },
    async session({ session, user }) {
      if (session?.user && user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
    async authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return auth?.user?.role === "PLATFORM_ADMIN";
      }
      return true;
    }
  },
  basePath: "/api/auth",
  trustHost: true
};

export function buildAuthConfig({ adapter, env = process.env } = {}) {
  const provider = createOidcProvider(env);
  if (!provider) throw new Error("Approved OIDC provider configuration is incomplete");
  return {
    ...authConfig,
    secret: env.AUTH_SECRET,
    adapter,
    providers: [provider],
    basePath: "/api/auth",
    trustHost: true
  };
}

export const rolePermissions = Object.freeze({
  PUBLIC_USER: ["catalog.read", "guidance.start"],
  CUSTOMER: ["catalog.read", "guidance.start", "booking.create", "order.read"],
  SUPPORT: ["catalog.read", "booking.read", "order.read"],
  CONTENT_EDITOR: ["catalog.read", "service.write"],
  TRANSLATOR: ["catalog.read", "translation.write"],
  LEGAL_REVIEWER: ["catalog.read", "service.approve", "knowledge.approve"],
  AI_REVIEWER: ["ai.evaluate", "ai.issue.review"],
  OPERATIONS_ADMIN: ["booking.manage", "order.manage"],
  PRIVACY_ADMIN: ["privacy.manage", "audit.read"],
  PLATFORM_ADMIN: ["*"]
});

export function hasPermission(role, permission) {
  const permissions = rolePermissions[role] ?? [];
  return permissions.includes("*") || permissions.includes(permission);
}
