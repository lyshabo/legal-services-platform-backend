# Environment Secrets Audit Report

## Scope

This audit implements the instructions in `Environment Secrets Audit.docx`
against the current Vercel, Supabase PostgreSQL, Prisma 6.12, Auth.js/OIDC, and
GitHub Actions architecture. It treats database credentials, authentication
secrets, development authentication keys, AI API keys, payment credentials, and
webhook secrets as production-grade secrets in every environment.

Audit date: August 29, 2026.

### August 29, 2026 recheck

After the request to resume live verification, the ten required values were
checked by name, presence, scope, and length only. None were visible in the
managed or unsandboxed execution process, User or Machine environment scopes,
ignored local environment files, or the GitHub `preview-verification`
environment. No workflow was dispatched. This is recorded as `BLOCKED` for
secret-channel availability and `NOT RUN` for the guarded workflow; no live
database, external OIDC, or Vercel result is inferred.

## Environment Variable Audit

| Variable | Required? | Purpose | Scope and configuration |
|---|---|---|---|
| `VERCEL_TOKEN` | Required for current custom CI/CD workflow | Authenticates Vercel CLI deployment and configuration operations | GitHub `preview-verification` environment secret only; never Vercel runtime or browser |
| `VERCEL_ORG_ID` | Required for current custom CI/CD workflow | Selects the approved Vercel organization | GitHub protected environment variable; not a secret and not browser configuration |
| `VERCEL_PROJECT_ID` | Required for current custom CI/CD workflow | Selects the approved Vercel project | GitHub protected environment variable; not a secret and not browser configuration |
| `DATABASE_URL` | Required for Prisma runtime | Pooled TLS PostgreSQL connection for Vercel server functions and live repository tests | Separate secret for development, preview, and production; server-only |
| `DIRECT_URL` | Required for Prisma migrations | Direct TLS PostgreSQL connection used by Prisma migration operations | Migration environment secret only; excluded from Vercel runtime |
| `AUTH_SECRET` | Required for Auth.js | Protects Auth.js tokens and state | Separate high-entropy secret for each environment; Vercel runtime secret |
| `AUTH_URL` | Required for current Auth.js HTTP bridge | Canonical trusted origin for callbacks, cookies, and request normalization | Protected configuration variable; exact approved HTTPS preview or production origin |
| `OIDC_ISSUER` | Required because current authentication is Auth.js with external OIDC | Locates and validates approved provider discovery metadata | Protected server configuration; HTTPS and exact issuer match required |
| `OIDC_CLIENT_ID` | Required for current OIDC client | Identifies the application to the identity provider | Protected server configuration; not a credential secret |
| `OIDC_CLIENT_SECRET` | Required for current OIDC client | Authenticates the server-side OIDC client | Vercel runtime secret; never browser-exposed |
| `DEV_ADMIN_KEY` | Required only when development login is explicitly selected | Authenticates the development-only administrator adapter | Development secret manager only; random, at least 32 characters, no default or browser prefill |
| `CLAUDE_API_KEY` | Optional; no live model adapter exists | Reserved for a future approved Claude/model adapter | Production-grade secret in every environment once used; currently must remain absent while model provider is disabled |
| `STRIPE_SECRET_KEY` | Optional; no live Stripe adapter exists | Reserved for future server-side payment operations | Production-grade secret in every environment once used; currently must remain absent while payment provider is disabled |
| `STRIPE_WEBHOOK_SECRET` | Optional; no live Stripe webhook exists | Reserved for future webhook signature verification | Production-grade secret in every environment once used |
| `SUPABASE_URL` | Incorrectly listed; removed | No Supabase browser client or Supabase Auth implementation exists | Not required by the current Prisma/PostgreSQL architecture |
| `SUPABASE_ANON_KEY` | Incorrectly listed; removed | No Supabase browser client exists | Not required; adding it would create an unnecessary browser/provider surface |

## When Each Variable Is Needed

| Variable group | Build | Application runtime | CI/CD | Migration | Authentication |
|---|---:|---:|---:|---:|---:|
| Vercel token/org/project | No | No | Yes | No | No |
| `DATABASE_URL` | No for current static/Prisma generation build | Yes | Yes for live contracts | Prisma may use it for generated client/runtime operations | Yes for database sessions |
| `DIRECT_URL` | No | No | Yes in database job | Yes | No |
| `AUTH_SECRET` | No | Yes | Yes for preview configuration | No | Yes |
| `AUTH_URL` | No | Yes | Yes for preview configuration | No | Yes |
| OIDC issuer/client ID/client secret | No | Yes | Yes for preview configuration and discovery | No | Yes |
| AI/payment secrets | No while adapters are disabled | Only after approved adapters are implemented | Only for corresponding guarded verification | No | No |

## Removed Unnecessary Requirements

- Removed `SUPABASE_URL` and `SUPABASE_ANON_KEY` from `.env.example` because
  the application uses Prisma against Supabase PostgreSQL and does not use
  Supabase Auth or the browser client.
- Removed `DIRECT_URL` from Vercel runtime configuration; it remains available
  only to the migration job.
- Reclassified `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `AUTH_URL`,
  `OIDC_ISSUER`, and `OIDC_CLIENT_ID` as protected configuration rather than
  secrets.
- Removed the source-controlled fixed development-key fallback and browser
  prefill.
- Removed source-controlled local PostgreSQL credentials from
  `.env.docker.example` and `compose.yaml`.
- Kept the custom Vercel workflow because it performs guarded migration,
  database contracts, environment configuration, and deployment verification.
  It must not be removed until an approved native integration replaces all of
  those functions.

## Required Manual Secrets

Current architecture:

- `VERCEL_TOKEN` for the custom GitHub deployment workflow.
- `DATABASE_URL` for the selected environment's pooled Supabase PostgreSQL
  connection.
- `DIRECT_URL` for the selected environment's direct migration connection.
- `AUTH_SECRET`, generated with approved cryptographic secret tooling.
- `OIDC_CLIENT_SECRET`, issued by the approved identity provider.
- `DEV_ADMIN_KEY` only for explicitly selected local development sessions.

Future approved adapters only:

- `CLAUDE_API_KEY`.
- `STRIPE_SECRET_KEY`.
- `STRIPE_WEBHOOK_SECRET`.

## Protected Configuration

- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `AUTH_URL`
- `OIDC_ISSUER`
- `OIDC_CLIENT_ID`

These values are not credential secrets, but changes remain security-sensitive
and require controlled review.

## Environment Separation

Development, preview, and production must use different database credentials,
Auth.js secrets, OIDC clients where supported, AI/payment credentials, and
storage/provider credentials. Production secrets must never be copied into
development or preview. `.env.example` and `.env.docker.example` contain names
only. `.env`, `.env.local`, `.env.*`, Vercel state, and provider credentials are
ignored by Git, with explicit exceptions only for the two example files.

## Validation Results

| Area | Result | Evidence |
|---|---|---|
| Build | PASS | Prisma Client 6.12 generated and exactly six approved public assets were built |
| Prisma | BLOCKED | `npm run prisma:validate` stopped fail-closed because real `DATABASE_URL` and `DIRECT_URL` are not present |
| Database | BLOCKED | No approved provider connection is visible to the process and Docker is unavailable; no migration, seed, `SELECT 1`, or live contract was claimed |
| Authentication | PASS LOCAL / BLOCKED EXTERNAL | Unit tests cover complete OIDC configuration, local callback/session/RBAC, production rejection of the dev adapter, and explicit strong dev-key enforcement; real provider flow remains blocked |
| Vercel deployment | BLOCKED | GitHub environment still lacks approved values |
| Security | PASS FOR IMPLEMENTED CHECKS | Public build and Git-tracked-file scans found no audited credential patterns, server-only names in public assets, or weak secret defaults |

## Test Evidence

- `npm test`: 18 tests, 17 passed, one guarded live-database test skipped,
  zero failed.
- `npm run test:e2e`: 18 passed, zero failed.
- `npm run vercel:build`: passed.
- `npm run secrets:audit`: passed.
- `npm run secrets:repo-audit`: passed.
- `git diff --check`: passed; only expected Windows line-ending notices were
  emitted.
- `npm run live:preflight`: blocked as designed and named the ten absent
  configuration variables without printing values.
- `npm run prisma:validate`: blocked as designed because no approved
  `DATABASE_URL` is present; no placeholder or localhost fallback was used.
- Development startup without a strong `DEV_ADMIN_KEY`: rejected as designed.
- Production seed without explicit `preview-fixture` mode: rejected as designed.

## Remaining Issues

- Approved values are still not visible to the execution process or GitHub
  environment.
- Docker is not installed or reachable in this execution environment.
- No real Supabase migration, seed, `SELECT 1`, or live contract result exists.
- No Vercel preview deployment has completed.
- External OIDC needs approved credentials, registered origins, a test
  identity, and an MFA procedure.
- AI and payment adapters remain unimplemented and gated; their secrets must not
  be configured merely to make readiness appear complete.
- Legal, privacy, security, jurisdiction, localization, commerce, and provider
  approvals remain open.
