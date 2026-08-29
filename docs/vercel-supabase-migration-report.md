# Vercel + Supabase Migration Report

**Date:** August 29, 2026

| Area | Check | Result | Evidence / blocker |
|---|---|---|---|
| Vercel | Configuration | PASS | `vercel.json`, isolated `dist/` build, catch-all API function |
| Vercel | Local public build | PASS | `npm run vercel:build` generated Prisma Client and copied only the six approved public assets into `dist/` |
| Vercel | Deployment readiness | BLOCKED | Vercel project/token configuration not supplied |
| Supabase | PostgreSQL configured | BLOCKED | Provider-issued `DATABASE_URL` and `DIRECT_URL` absent |
| Supabase | Secure connection | BLOCKED | No connection available for TLS/authentication test |
| Supabase | Database reachable | BLOCKED | No provider-issued connection available |
| Prisma | Version/configuration | PASS | Prisma 6.12; pooled `url` plus direct migration URL |
| Prisma | Schema validation | BLOCKED | Real database variables are required |
| Prisma | Migration | BLOCKED | No reachable Supabase PostgreSQL database |
| Prisma | Client generation | PASS | Prisma 6.12 client generation completed during `npm run vercel:build` |
| Prisma | Database query | BLOCKED | No reachable database |
| Security | Secrets protected | PASS | Secrets excluded from frontend output and Git |
| Security | Server-side authorization | PASS (implementation) | Protected API routes enforce server-side roles |
| Security | Client isolation | BLOCKED | Current implemented domain lacks live client/matter records |
| Security | Document protection | BLOCKED | Private storage provider and document workflow not configured |
| Application | Existing UI preserved | PASS | Existing browser assets retained |
| Application | Multilingual functionality | PASS | `npm run test:e2e`: 17 Playwright tests passed across the preserved multilingual, guidance, assessment, library, compendium, booking, admin, audit, and launch-gate flows |
| Application | API communication | PASS (local architecture) / BLOCKED (deployed) | Same-origin `/api/*` function boundary |
| Application | External authentication | BLOCKED | Approved OIDC values absent |
| Application | Legal-services workflow | PASS (development implementation) | Existing services, assessment, and booking routes retained |
| Application | Legal compendium workflow | PASS (gated interface) | Purchase and delivery remain disabled pending approval |

## Verification Evidence

| Command / check | Result | Evidence |
|---|---|---|
| `npm test` | PASS with guarded skip | 17 tests: 16 passed, 1 live PostgreSQL contract skipped because the approved database variables are absent, 0 failed |
| `npm run vercel:build` | PASS | Prisma Client generated and six intended browser assets prepared in `dist/` |
| `npm run test:e2e` | PASS | 17 Playwright tests passed, 0 failed |
| `node --check api/[...path].mjs` | PASS | Vercel function entry point parsed successfully |
| `node --check server.mjs` | PASS | Shared local/Vercel request handler parsed successfully |
| Supabase migration, seed, `SELECT 1`, live contracts | BLOCKED | Provider-issued pooled and direct TLS database URLs are not available |
| Vercel deployment and deployed API health | BLOCKED | Vercel project linkage and approved deployment credentials are not available |
| External Auth.js/OIDC flow | BLOCKED | Approved issuer, client, and secret configuration is not available |

These results validate the local configuration, build, implementation tests, and
browser behavior only. They do not establish a live Supabase connection,
successful Vercel deployment, external identity-provider operation, private
document protection, payment processing, or production approval.

## Manual Configuration Required

1. Create or connect a Vercel project to the private backend repository.
2. Create a Supabase project and set pooled `DATABASE_URL` and direct
   `DIRECT_URL` in Vercel development, preview, and production environments.
3. Add approved Auth.js/OIDC secrets.
4. Run non-destructive Prisma migration, seed, and live contract checks.
5. Configure the custom domain and verify HTTPS, authentication, authorization,
   multilingual routes, and frontend-to-backend communication.
6. Configure private document/publication storage, AI, and payment providers
   only after their separate approvals.

## Approved-Secret Retry - August 29, 2026

| Check | Result | Evidence / blocker |
|---|---|---|
| Official deployment workflow | PASS | The official Skywork `vercel-deploy` skill was installed for preview deployment |
| Vercel approved-secret preflight | BLOCKED | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` were absent at process, user, and machine scope |
| Supabase approved-secret preflight | BLOCKED | `DATABASE_URL` and `DIRECT_URL` were absent at process, user, and machine scope |
| Auth.js/OIDC approved-secret preflight | BLOCKED | `AUTH_SECRET`, `AUTH_URL`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET` were absent at process, user, and machine scope |
| GitHub repository secret path | BLOCKED | The private backend repository has no Actions secret names or repository variables configured |
| Existing Vercel connection | BLOCKED | The private backend repository has no GitHub deployment records or repository webhook records |
| Preview deployment | BLOCKED | An authenticated approved Vercel project is not available; the unclaimed unauthenticated fallback was not used |
| Prisma validation | BLOCKED | `npm run prisma:validate` stopped with the expected fail-closed message: `DATABASE_URL` is required and placeholder or localhost fallback is prohibited |
| Prisma migration deploy | BLOCKED | No provider-issued direct TLS connection is available |
| Prisma seed | BLOCKED | No reachable approved PostgreSQL database is available |
| PostgreSQL `SELECT 1` | BLOCKED | No reachable approved PostgreSQL database is available |
| Live Prisma contracts | BLOCKED | `PERSISTENCE_ADAPTER=prisma` cannot be activated without the approved database connection |
| External OIDC sign-in and callback | BLOCKED | No approved issuer/client configuration is available |
| Database session persistence and RBAC | BLOCKED | The live database and external identity provider are both unavailable |
| Logout and post-logout denial | BLOCKED | A real authenticated session cannot be created without the approved OIDC configuration |
| Local Auth.js test issuer | PASS (implementation only) | 3 tests passed for complete-provider gating, production rejection of development authentication, callback/session persistence, and RBAC |

Only presence and string length were inspected during secret preflight; no
secret values were printed, written to source control, or added to the report.
The repository's local Auth.js test-issuer coverage remains implementation
evidence only and is not represented as external-provider verification.
