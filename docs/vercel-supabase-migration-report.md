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
