import { Auth } from "@auth/core";
import { buildAuthConfig } from "./auth.config.mjs";
import { createPrismaAuthAdapter } from "./auth-prisma-adapter.mjs";

let configPromise;

export async function getRuntimeAuthConfig() {
  if (!configPromise) {
    configPromise = createPrismaAuthAdapter().then((adapter) => buildAuthConfig({ adapter }));
  }
  return configPromise;
}

function configuredOrigin() {
  return new URL(process.env.AUTH_URL).origin;
}

async function nodeRequestBody(request) {
  if (request.method === "GET" || request.method === "HEAD") return undefined;
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export async function toAuthRequest(request) {
  const incoming = new URL(request.url || "/", configuredOrigin());
  const url = new URL(`${incoming.pathname}${incoming.search}`, configuredOrigin());
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (value === undefined) continue;
    headers.set(name, Array.isArray(value) ? value.join(", ") : value);
  }
  headers.set("host", new URL(configuredOrigin()).host);
  return new Request(url, {
    method: request.method,
    headers,
    body: await nodeRequestBody(request),
    redirect: "manual"
  });
}

export async function runAuth(request, config = undefined) {
  return Auth(await toAuthRequest(request), config ?? (await getRuntimeAuthConfig()));
}

export async function writeAuthResponse(nodeResponse, authResponse) {
  const headers = {};
  for (const [name, value] of authResponse.headers.entries()) {
    if (name.toLowerCase() !== "set-cookie") headers[name] = value;
  }
  const cookies = authResponse.headers.getSetCookie?.() ?? [];
  if (cookies.length) headers["Set-Cookie"] = cookies;
  nodeResponse.writeHead(authResponse.status, headers);
  nodeResponse.end(Buffer.from(await authResponse.arrayBuffer()));
}

export async function handleAuthRequest(request, response) {
  await writeAuthResponse(response, await runAuth(request));
}

export async function getAuthSessionFromCookie(cookieHeader = "", config = undefined) {
  const request = new Request(`${configuredOrigin()}/api/auth/session`, {
    headers: { cookie: cookieHeader }
  });
  const response = await Auth(request, config ?? (await getRuntimeAuthConfig()));
  if (!response.ok) return null;
  const session = await response.json();
  return session?.user ? session : null;
}
