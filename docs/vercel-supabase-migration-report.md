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

## Blocked Prerequisites and Owner Actions

| Prerequisite | Status | Required owner | Required action | Blocking effect |
|---|---|---|---|---|
| Approved secret injection | BLOCKED | Workspace / secret-channel administrator | Expose the approved variables to the execution process without placing values in chat, files, logs, or source control | Blocks every authenticated Vercel, Supabase, and external OIDC operation |
| Vercel access | BLOCKED | Vercel project administrator | Supply an approved token, organization ID, and project ID; confirm the private Git repository is authorized for the project | Blocks project linkage, preview deployment, deployment URL, and deployed API verification |
| Supabase pooled connection | BLOCKED | Supabase database administrator | Supply the provider-issued TLS pooler `DATABASE_URL` for serverless/runtime traffic | Blocks Prisma runtime connectivity and live repository contracts |
| Supabase direct connection | BLOCKED | Supabase database administrator | Supply the provider-issued direct TLS `DIRECT_URL` with migration privileges | Blocks schema validation against the intended provider, migration deployment, and seed |
| Migration authorization | BLOCKED | Database owner / release manager | Confirm that the checked-in non-destructive migration and seed are authorized for the selected environment | Blocks applying database changes even after connectivity is available |
| OIDC client configuration | BLOCKED | Identity-provider administrator | Supply the approved issuer, client ID, client secret, callback URL registration, and logout configuration | Blocks real sign-in, callback, and logout |
| OIDC test identity | BLOCKED | Identity / security owner | Provide an approved interactive test identity and any required MFA/test procedure through the approved access process | Client credentials alone cannot complete an end-user authorization-code flow |
| Auth.js canonical origin | BLOCKED | Vercel and identity-provider administrators | Ensure `AUTH_URL` exactly matches the approved preview origin and registered callback origin | Blocks trusted callback handling and cookie/session validation |
| Database session verification | BLOCKED | Application security owner | Authorize inspection of test-only user, account, and session records created by the verification run | Blocks evidence for database session persistence and deletion |
| RBAC test assignments | BLOCKED | Application security / IAM owner | Approve test roles for one allowed and one denied route outcome without granting broader production access | Blocks live allow/deny RBAC evidence |
| GitHub verification secrets | BLOCKED | GitHub repository administrator | Add the approved values as environment secrets under `preview-verification` | Blocks the guarded GitHub Actions workflow at preflight |
| Private storage and document protection | BLOCKED | Security / privacy / storage owner | Select and configure private object storage, retention, malware scanning, access logging, and signed URL controls | Blocks document-security and confidential-file readiness |
| Live AI provider | BLOCKED | AI governance and security owners | Approve provider, model, data-use terms, retention, prompt safeguards, and server-only credentials | Blocks live AI processing; controlled development behavior remains the only evidence |
| Payments and commerce | BLOCKED | Commerce, finance, and legal owners | Approve prices, currencies, tax/refund terms, payment provider, webhook verification, and fulfillment rules | Blocks purchase, payment, and compendium delivery |
| Identity and credential claims | BLOCKED | Identity / content owner and legal reviewer | Authenticate identity, credentials, Bar status, affiliations, publications, and permission to publish | Blocks broader publication of unresolved professional claims |
| Jurisdiction and legal-service scope | BLOCKED | Qualified legal reviewer | Approve supported jurisdictions, service descriptions, exclusions, disclaimers, and escalation boundaries | Blocks production legal-service publication |
| Privacy and security approval | BLOCKED | Privacy and security owners | Approve notices, lawful basis, retention, incident response, access controls, threat model, and vendor processing | Blocks intake of confidential production data |
| Qualified translations | BLOCKED | Named qualified language reviewers | Record reviewer qualifications, target regions, terminology decisions, and dated approval for French, Simplified Chinese, and Traditional Chinese | Blocks qualified multilingual publication |
| Final release approval | BLOCKED | Product owner and all gate owners | Review the completed evidence report and explicitly approve production release after all upstream gates pass | Keeps the production and publication gates closed |

## Guarded GitHub Verification Run

**Date:** August 29, 2026

**Commit:** `f5a1d124a221114f7375fdf8280573825c711a15`

**Workflow run:** `33262776299`

| Job | Result | Evidence |
|---|---|---|
| Protected environment | PASS | GitHub environment `preview-verification` created and restricted to the `master` branch |
| Workflow installation | PASS | Manually dispatched workflow is present on the private repository |
| Secret upload | BLOCKED | No approved values were visible to the execution process, including outside the sandbox, so no values could be uploaded |
| Preflight | FAIL (expected guard) | All ten required environment secrets were absent; the job exited with code 2 and named only missing variable names |
| Database job | SKIP | GitHub skipped the job because preflight did not pass |
| Preview deployment job | SKIP | GitHub skipped the job because the database job did not run |
| Secret exposure review | PASS | The workflow output contained empty secret fields and missing-variable names only; no secret values were printed |

The workflow is ready to rerun after the approved values are actually injected
into the execution process or added directly as GitHub environment secrets. A
claim that the values were exposed is not sufficient evidence when process,
user, machine, local ignored-file, and GitHub environment checks all show them
as absent.
