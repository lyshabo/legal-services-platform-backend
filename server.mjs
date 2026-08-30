import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createServiceVersion, listAuditEvents, listServiceVersions, listServices } from "./server-repository.mjs";
import {
  clearSessionCookies,
  createDevSession,
  developmentLoginEnabled,
  destroySession,
  getSession,
  isValidDevKey,
  recordLogin,
  requireRole,
  sessionCookie,
  assertAuthenticationConfiguration,
  authAdapterName
} from "./server-auth.mjs";
import {
  createQuestionnaireVersion,
  getQuestionnaire,
  submitQuestionnaire
} from "./questionnaire-repository.mjs";
import {
  createAvailabilityRule,
  createBooking,
  listAvailabilityRules,
  listBookingSlots,
  listBookings,
  reconcilePayment,
  resetDevelopmentBookings,
  updateAvailabilityRule,
  updateBookingStatus
} from "./booking-repository.mjs";
import { createAssessment, listAssessments, reviewAssessment } from "./assessment-repository.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const appEnvironment = process.env.APP_ENV || "development";
const host = process.env.HOST || (appEnvironment === "production" ? "0.0.0.0" : "127.0.0.1");
const paymentProvider =
  process.env.PAYMENT_PROVIDER || (appEnvironment === "development" ? "development" : "disabled");
assertAuthenticationConfiguration();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function json(response, status, body, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function handleApi(request, response) {
  const url = new URL(request.url || "/", "http://127.0.0.1");
  const path = url.pathname;

  if (request.method === "GET" && path === "/api/health") {
    json(response, 200, {
      ok: true,
      environment: appEnvironment,
      persistence: process.env.PERSISTENCE_ADAPTER || "json",
      authentication: authAdapterName,
      developmentLoginEnabled
    });
    return true;
  }
  if (request.method === "GET" && path === "/api/auth/config") {
    json(response, 200, {
      adapter: authAdapterName,
      developmentLoginEnabled,
      signInUrl: authAdapterName === "authjs" ? "/api/auth/signin" : null
    });
    return true;
  }
  if (request.method === "GET" && path === "/api/services") {
    json(response, 200, { services: await listServices({ publishedOnly: true }) });
    return true;
  }
  if (request.method === "POST" && path === "/api/auth/dev-login") {
    if (!developmentLoginEnabled) {
      json(response, 404, { error: "Not found" });
      return true;
    }
    const body = await readJson(request);
    if (!isValidDevKey(body.key)) {
      json(response, 401, { error: "Invalid development key" });
      return true;
    }
    const session = createDevSession();
    await recordLogin(session.user);
    json(response, 200, { user: session.user }, { "Set-Cookie": sessionCookie(session) });
    return true;
  }
  if (request.method === "POST" && path === "/api/auth/logout") {
    await destroySession(request);
    json(response, 200, { ok: true }, { "Set-Cookie": clearSessionCookies() });
    return true;
  }
  if (request.method === "GET" && path === "/api/admin/session") {
    const user = await requireRole(request);
    json(response, 200, { authenticated: Boolean(user), user: user ?? null });
    return true;
  }
  if (request.method === "POST" && path === "/api/assessments") {
    const body = await readJson(request);
    const assessment = await createAssessment(body);
    json(response, 201, assessment);
    return true;
  }
  if (request.method === "GET" && path === "/api/admin/assessments") {
    const user = await requireRole(request);
    if (!user) { json(response, 401, { error: "Authentication required" }); return true; }
    json(response, 200, { assessments: await listAssessments({ status: url.searchParams.get("status") || undefined }) });
    return true;
  }
  const assessmentReviewMatch = path.match(/^\/api\/admin\/assessments\/([^/]+)\/review$/);
  if (assessmentReviewMatch && request.method === "PATCH") {
    const user = await requireRole(request);
    if (!user) { json(response, 401, { error: "Authentication required" }); return true; }
    const body = await readJson(request);
    const updated = await reviewAssessment(assessmentReviewMatch[1], user, body.status, body.reviewNote);
    if (!updated) { json(response, 404, { error: "Assessment not found or invalid status" }); return true; }
    json(response, 200, updated);
    return true;
  }

  const versionMatch = path.match(/^\/api\/admin\/services\/([^/]+)\/versions$/);
  if (versionMatch && request.method === "GET") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const service = await listServiceVersions(versionMatch[1]);
    if (!service) {
      json(response, 404, { error: "Service not found" });
      return true;
    }
    json(response, 200, service);
    return true;
  }
  if (versionMatch && request.method === "POST") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const body = await readJson(request);
    if (!body.translations || typeof body.translations !== "object") {
      json(response, 400, { error: "translations object is required" });
      return true;
    }
    const service = await createServiceVersion(versionMatch[1], body, user);
    if (!service) {
      json(response, 404, { error: "Service not found" });
      return true;
    }
    json(response, 201, service);
    return true;
  }
  if (request.method === "GET" && path === "/api/admin/audit") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    json(response, 200, {
      events: await listAuditEvents({
        action: url.searchParams.get("action") || undefined,
        actorId: url.searchParams.get("actorId") || undefined,
        targetType: url.searchParams.get("targetType") || undefined,
        targetId: url.searchParams.get("targetId") || undefined,
        from: url.searchParams.get("from") || undefined,
        to: url.searchParams.get("to") || undefined
      })
    });
    return true;
  }
  if (request.method === "GET" && path === "/api/questionnaires/orientation") {
    json(response, 200, await getQuestionnaire());
    return true;
  }
  if (request.method === "POST" && path === "/api/questionnaires/orientation/submit") {
    const body = await readJson(request);
    const result = await submitQuestionnaire("questionnaire-orientation", body);
    if (result.error || result.ok === false) {
      json(response, result.statusCode ?? 400, result);
      return true;
    }
    json(response, 201, result);
    return true;
  }
  if (request.method === "GET" && path === "/api/admin/questionnaires/orientation") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    json(response, 200, await getQuestionnaire());
    return true;
  }
  if (request.method === "POST" && path === "/api/admin/questionnaires/orientation/versions") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const body = await readJson(request);
    const result = await createQuestionnaireVersion("questionnaire-orientation", body, user);
    if (!result) {
      json(response, 404, { error: "Questionnaire not found" });
      return true;
    }
    json(response, 201, result);
    return true;
  }
  if (request.method === "GET" && path === "/api/admin/availability") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    json(response, 200, {
      rules: await listAvailabilityRules({ serviceId: url.searchParams.get("serviceId") || undefined })
    });
    return true;
  }
  if (request.method === "POST" && path === "/api/admin/availability") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const result = await createAvailabilityRule(await readJson(request), user);
    json(response, result.error ? result.statusCode ?? 400 : 201, result);
    return true;
  }
  const availabilityMatch = path.match(/^\/api\/admin\/availability\/([^/]+)$/);
  if (availabilityMatch && request.method === "PATCH") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const result = await updateAvailabilityRule(
      decodeURIComponent(availabilityMatch[1]),
      await readJson(request),
      user
    );
    if (!result) {
      json(response, 404, { error: "Availability rule not found" });
      return true;
    }
    json(response, 200, result);
    return true;
  }
  if (request.method === "GET" && path === "/api/admin/bookings") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    json(response, 200, {
      bookings: await listBookings({ status: url.searchParams.get("status") || undefined })
    });
    return true;
  }
  const adminBookingMatch = path.match(/^\/api\/admin\/bookings\/([^/]+)$/);
  if (adminBookingMatch && request.method === "PATCH") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const body = await readJson(request);
    const result = await updateBookingStatus(
      decodeURIComponent(adminBookingMatch[1]),
      body.status,
      user,
      body.reason
    );
    if (!result) {
      json(response, 404, { error: "Booking not found" });
      return true;
    }
    json(response, result.error ? result.statusCode ?? 400 : 200, result);
    return true;
  }
  const adminPaymentMatch = path.match(/^\/api\/admin\/bookings\/([^/]+)\/payment$/);
  if (adminPaymentMatch && request.method === "POST") {
    const user = await requireRole(request);
    if (!user) {
      json(response, 401, { error: "Authentication required" });
      return true;
    }
    const result = await reconcilePayment({
      ...(await readJson(request)),
      bookingId: decodeURIComponent(adminPaymentMatch[1]),
      actor: user
    });
    json(response, result.error ? result.statusCode ?? 400 : 200, result);
    return true;
  }
  if (request.method === "GET" && path === "/api/booking/slots") {
    const timezone = new URL(request.url, "http://127.0.0.1").searchParams.get("timezone") || "UTC";
    json(response, 200, { slots: await listBookingSlots({ timezone }) });
    return true;
  }
  if (request.method === "POST" && path === "/api/booking") {
    const body = await readJson(request);
    if (!body.idempotencyKey) {
      json(response, 400, { error: "idempotencyKey is required" });
      return true;
    }
    const result = await createBooking(body);
    if (result.error) {
      json(response, result.statusCode ?? 400, result);
      return true;
    }
    json(response, 201, result);
    return true;
  }
  const paymentMatch = path.match(/^\/api\/booking\/([^/]+)\/payment$/);
  if (paymentMatch && request.method === "POST") {
    if (
      appEnvironment !== "development" ||
      paymentProvider !== "development"
    ) {
      json(response, 404, { error: "Not found" });
      return true;
    }
    const body = await readJson(request);
    if (!body.idempotencyKey || !body.status) {
      json(response, 400, { error: "idempotencyKey and status are required" });
      return true;
    }
    const result = await reconcilePayment({ ...body, bookingId: paymentMatch[1] });
    if (result.error) {
      json(response, result.statusCode ?? 400, result);
      return true;
    }
    json(response, 200, result);
    return true;
  }
  if (request.method === "POST" && path === "/api/dev/reset-bookings") {
    if (appEnvironment !== "development") {
      json(response, 404, { error: "Not found" });
      return true;
    }
    const result = await resetDevelopmentBookings();
    json(response, 200, { ok: true, ...result });
    return true;
  }
  return false;
}

export async function handleRequest(request, response) {
  if ((request.url || "").startsWith("/api/")) {
    try {
      if (
        authAdapterName === "authjs" &&
        (request.url || "").startsWith("/api/auth/") &&
        !["/api/auth/config", "/api/auth/logout"].includes((request.url || "").split("?")[0])
      ) {
        const { handleAuthRequest } = await import("./auth-runtime.mjs");
        await handleAuthRequest(request, response);
        return;
      }
      if (await handleApi(request, response)) return;
      json(response, 404, { error: "API route not found" });
    } catch (error) {
      console.error(error);
      json(response, 500, { error: "Internal server error" });
    }
    return;
  }
  const rawPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const requested = rawPath === "/" ? "index.html" : rawPath.replace(/^\/+/, "");
  const safePath = normalize(requested);

  if (safePath.startsWith("..") || safePath.includes(":")) {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const filePath = join(root, safePath);
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mime[extname(filePath)] || "application/octet-stream",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
  });
  createReadStream(filePath).pipe(response);
}

const isMainModule =
  process.argv[1] && fileURLToPath(import.meta.url) === normalize(process.argv[1]);

if (isMainModule) {
  const server = createServer(handleRequest);
  server.listen(port, host, () => {
    console.log(`Legal Services Platform server listening on ${host}:${port}`);
  });
}
