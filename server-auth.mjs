import { randomBytes, timingSafeEqual } from "node:crypto";
import { appendAudit } from "./server-repository.mjs";
import { hasPermission } from "./auth.config.mjs";

const sessions = new Map();
const SESSION_COOKIE = "lsp_session";
const SESSION_TTL_MS = 60 * 60 * 1000;
const DEV_ADMIN_KEY = process.env.DEV_ADMIN_KEY || "";
export const appEnvironment = process.env.APP_ENV || "development";
export const authAdapterName =
  process.env.AUTH_ADAPTER || (appEnvironment === "development" ? "dev" : "authjs");
export const developmentLoginEnabled =
  appEnvironment === "development" && authAdapterName === "dev";

function token() {
  return randomBytes(24).toString("hex");
}

export function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => {
        const normalized = part.trim();
        const separator = normalized.indexOf("=");
        return separator > 0
          ? [normalized.slice(0, separator), normalized.slice(separator + 1)]
          : [];
      })
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [key, decodeURIComponent(value)])
  );
}

export function createDevSession() {
  if (!developmentLoginEnabled) {
    throw new Error("Local development login requires APP_ENV=development and AUTH_ADAPTER=dev");
  }
  const sessionToken = token();
  const session = {
    id: sessionToken,
    user: {
      id: "dev-admin",
      role: "platform_admin",
      name: "Development administrator"
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString()
  };
  sessions.set(sessionToken, session);
  return session;
}

export async function getSession(request) {
  if (authAdapterName === "authjs") {
    const { getAuthSessionFromCookie } = await import("./auth-runtime.mjs");
    return getAuthSessionFromCookie(request.headers.cookie || "");
  }
  const tokenValue = parseCookies(request.headers.cookie)[SESSION_COOKIE];
  if (!tokenValue) return null;
  const session = sessions.get(tokenValue) ?? null;
  if (session && new Date(session.expiresAt).getTime() <= Date.now()) {
    sessions.delete(tokenValue);
    return null;
  }
  return session;
}

export function sessionCookie(session) {
  return `${SESSION_COOKIE}=${encodeURIComponent(session.id)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`;
}

export function clearSessionCookie() {
  const cookieName = authAdapterName === "authjs" ? "authjs.session-token" : SESSION_COOKIE;
  return `${cookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function clearSessionCookies() {
  if (authAdapterName !== "authjs") return [clearSessionCookie()];
  return [
    "authjs.session-token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    "__Secure-authjs.session-token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
  ];
}

export async function destroySession(request) {
  const cookies = parseCookies(request.headers.cookie);
  if (authAdapterName === "authjs") {
    const sessionToken = cookies["authjs.session-token"] ?? cookies["__Secure-authjs.session-token"];
    if (sessionToken) {
      const { getPrisma } = await import("./prisma-client.mjs");
      await (await getPrisma()).session.deleteMany({ where: { sessionToken } });
    }
    return;
  }
  const sessionToken = cookies[SESSION_COOKIE];
  if (sessionToken) sessions.delete(sessionToken);
}

export function isValidDevKey(value) {
  if (!developmentLoginEnabled) return false;
  const supplied = Buffer.from(String(value || ""));
  const expected = Buffer.from(DEV_ADMIN_KEY);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function requireRole(request, role = "PLATFORM_ADMIN") {
  const session = await getSession(request);
  if (!sessionHasRole(session, role)) return null;
  return session.user;
}

export function sessionHasRole(session, role = "PLATFORM_ADMIN") {
  return Boolean(
    session?.user?.role && session.user.role.toUpperCase() === role.toUpperCase()
  );
}

export async function requirePermission(request, permission) {
  const session = await getSession(request);
  const role = session?.user?.role;
  if (!role || !hasPermission(role.toUpperCase(), permission)) return null;
  return session.user;
}

export async function recordLogin(user) {
  await appendAudit({
    action: "auth.dev-login",
    actorId: user.id,
    actorRole: user.role,
    targetId: user.id,
    at: new Date().toISOString()
  });
}

export function assertAuthenticationConfiguration() {
  if (appEnvironment !== "development" && authAdapterName === "dev") {
    throw new Error("AUTH_ADAPTER=dev is prohibited outside APP_ENV=development");
  }
  if (developmentLoginEnabled && DEV_ADMIN_KEY.length < 32) {
    throw new Error(
      "DEV_ADMIN_KEY must be supplied through an approved secret mechanism and contain at least 32 characters"
    );
  }
  if (authAdapterName === "authjs") {
    const required = [
      "AUTH_URL",
      "AUTH_SECRET",
      "OIDC_ISSUER",
      "OIDC_CLIENT_ID",
      "OIDC_CLIENT_SECRET",
      "DATABASE_URL"
    ];
    const missing = required.filter((name) => !process.env[name]);
    if (missing.length) {
      throw new Error(`Auth.js OIDC configuration is incomplete: ${missing.join(", ")}`);
    }
  }
}
