# Legal Services Platform

Development foundation for a multilingual legal-services platform with professional services, a legal-resource library, booking and intake architecture, and controlled source-governed guidance.

## Current Scope

Implemented:

- Responsive public experience.
- English, French, and Chinese localization.
- Searchable and filterable service and product fixtures.
- Service and product detail routes.
- Development booking adapter.
- Locally validated contact form.
- Server-side development persistence for versioned services and translations.
- PostgreSQL Compose environment and Prisma repositories for services, questionnaires, availability, bookings, payments, users, sessions, and audit events.
- Development administrator session, server-side role gate, and append-only audit events.
- Validated PostgreSQL/Prisma schema and checked-in initial migration.
- Auth.js-compatible session callbacks, RBAC policy, and Prisma adapter contract.
- Auth.js Core OIDC sign-in/callback/session bridge with linked accounts and database sessions.
- Versioned questionnaire API and required-answer validation.
- Time-zone-aware booking slots.
- Idempotent booking holds and payment reconciliation.
- Booking and payment provider interfaces with explicit development adapters.
- Controlled preliminary-guidance routing with safe refusal and urgency escalation.
- Launch-gate administration persisted in browser storage.
- Production-readiness evaluator.
- Automated core-logic tests.
- Playwright end-to-end tests.
- Dependency-free local HTTP server with restrictive security headers.

Not implemented or production-approved:

- Verified professional identity or credentials.
- Approved jurisdictions or legal content.
- Live OIDC credentials and end-to-end identity-provider verification.
- Live payment, calendar, email, analytics, storage, or AI model providers.
- Production commerce, bookings, intake submissions, or AI answers.

These features remain disabled, development-only, or blocked by explicit launch gates.

## Run

Requires Node.js 20 or later.

```powershell
node server.mjs
```

Open:

`http://127.0.0.1:4173`

## Validate

```powershell
node --test tests/*.test.mjs
node scripts/readiness.mjs
node --check app.js
```

Or run all checks:

```powershell
npm.cmd run validate
```

Run browser tests:

```powershell
npx.cmd playwright test
```

Validate the Prisma schema:

```powershell
npm.cmd run prisma:validate
```

The command requires an explicitly supplied provider or approved development
`DATABASE_URL`. It never invents a localhost, SQLite, or placeholder
connection string and does not connect to or modify a database.

The readiness command intentionally reports `BLOCKED` because required launch approvals and production providers are absent. To make a deployment pipeline fail when blockers exist:

```powershell
$env:REQUIRE_PRODUCTION_READY='true'
node scripts/readiness.mjs
```

## Architecture

- `index.html`: application entry.
- `app.js`: route rendering, interaction binding, local state, and views.
- `platform-core.js`: pure locale, filtering, routing, guidance, and readiness logic.
- `data.js`: development fixtures, launch gates, provider modes, and approved development source metadata.
- `i18n.js`: English, French, and Chinese interface copy.
- `styles.css`: responsive design system.
- `server.mjs`: local static server and security headers.
- `server-repository.mjs`: versioned service persistence and audit repository.
- `server-auth.mjs`: development-only authenticated session adapter.
- `auth.config.mjs`: Auth.js-compatible callbacks and RBAC policy.
- `auth-prisma-adapter.mjs`: Prisma-backed Auth.js adapter contract.
- `auth-runtime.mjs`: Auth.js Core HTTP bridge for `/api/auth/*`.
- `questionnaire-repository.mjs`: versioned questionnaire and submission validation.
- `booking-repository.mjs`: slot, booking, idempotency, and payment reconciliation logic.
- `providers.mjs`: booking and payment provider interfaces.
- `prisma/schema.prisma`: PostgreSQL data model.
- `prisma/migrations/0001_init/migration.sql`: generated initial migration.
- `data/services-store.json`: server-side versioned service records.
- `data/audit-events.jsonl`: append-only development audit log.
- `tests/`: core behavioral tests.
- `tests/e2e/`: Playwright browser tests.
- `scripts/readiness.mjs`: fail-closed readiness report.
- `docs/`: governance and implementation documentation.

## Important Boundary

This repository is a development foundation. It does not provide legal advice, legal clearance, professional representation, confidentiality guarantees, deadline protection, or an approved commercial offering.

## Target Production Architecture

See [`docs/full-stack-architecture.md`](docs/full-stack-architecture.md) for the specific migration target:

- Next.js App Router and TypeScript.
- PostgreSQL and Prisma.
- Auth.js or approved OIDC.
- Server-side RBAC.
- Provider adapters for payments, booking, notifications, storage, search, analytics, and model access.

## Vercel Migration

The production migration target is Vercel with Supabase PostgreSQL and Prisma.
The existing interface is built into `dist/`; server-side `/api/*` routes are
handled by `api/[...path].mjs`. GitHub Pages remains available as a reference
demo until the Vercel deployment is successfully validated.

Required Vercel server-side variables include `DATABASE_URL`, `DIRECT_URL`,
`AUTH_SECRET`, `AUTH_URL`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and
`OIDC_CLIENT_SECRET`. Configure these separately for development, preview, and
production. Never commit them or expose them through browser code.

## PostgreSQL Activation

Docker Compose binds PostgreSQL to localhost only and uses development-only
credentials. The application continues to use development adapters unless
explicitly configured.

```powershell
$env:DATABASE_URL='postgresql://legal_services:local-development-only@127.0.0.1:5432/legal_services?schema=public'
$env:PERSISTENCE_ADAPTER='prisma'
$env:APP_ENV='development'
$env:AUTH_ADAPTER='dev'
docker compose up -d postgres
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run test:db
node server.mjs
```

For Auth.js OIDC, set `AUTH_ADAPTER=authjs`, `AUTH_SECRET`, `OIDC_ISSUER`,
`OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`. Local key login is rejected unless
both `APP_ENV=development` and `AUTH_ADAPTER=dev`.

A live PostgreSQL migration was not run on August 27, 2026 because Docker,
PostgreSQL, and `psql` were not installed or available in this workspace. The
schema, migration, seed, Compose definition, and conditional live contract tests
are checked in and validated without claiming a live database pass.
