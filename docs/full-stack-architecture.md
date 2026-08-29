# Specific Full-Stack Architecture

## Target Production Stack

The current repository is a dependency-light development foundation. The
selected migration architecture preserves the existing interface and adds a
server-side production boundary:

- Vercel-hosted static HTML, CSS, and JavaScript built into an isolated `dist/`
  directory.
- Vercel Node server functions for same-origin `/api/*` requests.
- PostgreSQL with Prisma migrations.
- Auth.js Core with an approved OIDC provider for authentication.
- Server-side RBAC with explicit roles and permissions.
- Zod for trusted-boundary validation.
- Object storage with private buckets and signed, expiring URLs.
- Hosted/tokenized payments behind `PaymentProvider`.
- Calendar/booking integration behind `BookingProvider`.
- Email/SMS behind `NotificationProvider`.
- Search/vector retrieval behind `SearchProvider`.
- Model gateway behind `ModelProvider`.
- OpenTelemetry-compatible observability with privacy-aware event filters.
- Playwright for browser tests and Vitest or Node test runner for pure logic.

## Hosted PostgreSQL Boundary

Use Supabase PostgreSQL as the managed provider. Keep the existing GitHub Pages
deployment as a reference demo until the Vercel migration is validated:

`Vercel frontend + server functions -> Prisma -> Supabase PostgreSQL`

Use a direct provider connection for migration and administration where
supported, and a pooler connection for application/serverless traffic when
required. Never expose `DATABASE_URL`, database credentials, Prisma
credentials, or private storage keys to browser code. Store them only in the
approved runtime secret mechanism and keep development, staging, and production
databases separate.

## Backend Deployment Target

The approved migration target in the supplied specification is Vercel. The
existing static UI is emitted into `dist/`, while `/api/*` requests execute
through Vercel server functions. Browser code continues to call same-origin API
paths and never imports Prisma or receives database credentials.

Until a deployment target, domain/origin allowlist, runtime secret store, and
provider-issued database credentials are approved, backend deployment and
frontend-to-backend verification remain blocked.

### Deployment Readiness Status - August 29, 2026

- Target: Vercel project linked to the private backend GitHub repository.
- Backend source repository: **PASS**; private repository created and pushed.
- Vercel configuration: **PASS**; server function and isolated public-asset
  build configuration are checked in.
- Vercel account/project linkage: **Blocked**; no Vercel token, project ID, or
  organization ID is configured.
- PostgreSQL: **Blocked**; no provider-issued Supabase or Neon TLS
  `DATABASE_URL` or migration `DIRECT_URL` is available through the approved
  secret mechanism.
- OIDC: **Blocked**; approved runtime identity-provider secrets are absent.
- Frontend-to-backend verification: **Blocked** until the API is deployed,
  HTTPS-enabled, origin-restricted, and connected to the approved database and
  identity provider.

## Current Adapter Implementation

The current transition architecture uses:

- `server.mjs` as a small HTTP boundary.
- Prisma repositories when `PERSISTENCE_ADAPTER=prisma`, with JSON/in-memory
  adapters retained only as explicit development fallbacks.
- `server-auth.mjs` as an explicitly gated development session adapter.
- `auth-runtime.mjs` as the Node HTTP bridge for Auth.js sign-in, callback,
  session, and sign-out routes.
- `data/services-store.json` as versioned service storage.
- `data/audit-events.jsonl` as append-only audit storage.
- `auth.config.mjs` as the Auth.js-compatible callback and RBAC policy.
- `auth-prisma-adapter.mjs` as the Prisma-backed Auth.js adapter contract.
- `providers.mjs` as the booking and payment provider interfaces.

The adapters expose the production boundary without claiming production readiness.

## Persistence Contract

The implemented Prisma persistence contract includes:

- `Service`
- `ServiceVersion`
- `ServiceTranslation`
- `AuditEvent`
- `User`
- `Role`
- `Session`
- `Questionnaire`, versioned questions, translations, submissions, and answers
- `AvailabilityRule`, `BookingSlot`, `Booking`, and status history
- `PaymentAttempt`

Published versions are immutable. A public query selects only approved/published versions. Every version create, publish, suspend, or rollback action records actor, role, target, version, status, timestamp, and correlation metadata.

## Authentication and Authorization

The current development login requires the local key `development-only-admin`,
issues an HttpOnly session cookie, and is available only when
`APP_ENV=development` and `AUTH_ADAPTER=dev`. It is not suitable for production.

The Auth.js-compatible configuration builds a generic approved OIDC provider
only when issuer, client ID, and client secret are supplied. It uses PKCE,
state, and nonce checks, persists linked accounts and database sessions, and
rejects users without an email address. Selecting `AUTH_ADAPTER=authjs` with
incomplete OIDC or database configuration stops the server.

Production must replace this adapter with approved identity infrastructure and enforce:

- Server-side authorization.
- Least privilege.
- Separate content editing and publishing permissions.
- Restricted access to sensitive submissions and AI records.
- Periodic access review.

## Migration Path

1. Preserve the provider and repository interfaces.
2. Activate the implemented Prisma repositories against provisioned PostgreSQL.
3. Supply approved OIDC credentials and exercise the runtime Auth.js request
   handler against the real identity provider.
4. Replace development booking/payment providers with approved vendor adapters.
5. Keep readiness gates and development adapters fail-closed in production.

## Database Activation

When a real provider-issued connection is available, set:

```text
PERSISTENCE_ADAPTER=prisma
DATABASE_URL=<provider-issued TLS connection; never commit or print>
DIRECT_URL=<provider-issued direct TLS connection; never commit or print>
AUTH_ADAPTER=authjs
```

Then run:

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate deploy
npm.cmd run db:seed
npm.cmd run test:db
```

The checked-in initial migration covers services, translations, users, roles,
sessions, audit events, versioned questionnaires, questionnaire submissions,
availability, booking slots, bookings, status history, and payment attempts.
Slot claims, questionnaire version increments, and payment reconciliation use
serializable transactions and PostgreSQL row locks.

If no reachable provider-issued `DATABASE_URL` is available, stop at schema and
configuration validation and report live migration, seed, connectivity, and
contract checks as `BLOCKED`; never substitute a localhost or placeholder URL.
