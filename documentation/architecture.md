# Architecture
## Product and Assumptions

The repository is a multilingual legal-services platform foundation. Its public
browser interface is static HTML, CSS, and JavaScript. Sensitive operations
cross a same-origin `/api/*` boundary into Vercel Node server functions. Prisma
connects server-side to Supabase PostgreSQL. Auth.js uses one approved external
OIDC provider and database-backed sessions.

The browser is untrusted. It never receives PostgreSQL credentials, Auth.js
secrets, OIDC client secrets, Vercel tokens, AI keys, payment secrets, or direct
migration credentials.

## Stack

- Browser: dependency-light HTML/CSS/JavaScript.
- Hosting: Vercel static output plus Node server functions.
- Database: Supabase PostgreSQL.
- ORM: Prisma 6.12.
- Authentication: Auth.js Core with approved OIDC.
- Authorization: server-side roles and permissions.
- Verification: Node tests and Playwright.
- CI/CD: manually dispatched, protected GitHub Actions preview workflow.

## Trust Boundaries

1. Browser to `/api/*`: all authorization and validation occur server-side.
2. Vercel function to PostgreSQL: pooled `DATABASE_URL`; server-only.
3. GitHub migration job to PostgreSQL: `DATABASE_URL` plus direct
   `DIRECT_URL`; secrets never enter browser or Vercel runtime.
4. Vercel function to OIDC provider: client secret stays server-side.
5. GitHub workflow to Vercel: `VERCEL_TOKEN` stays in the protected CI
   environment.
6. Future AI/payment providers: disabled until approved adapters, retention,
   webhook, and data-use controls exist.

## Authentication Flow

Auth.js constructs the OIDC provider only from complete approved configuration.
PKCE, state, and nonce checks are enabled. Users without email are rejected.
Accounts and sessions persist through the Prisma adapter. Server routes read the
database-backed session and enforce RBAC.

Development authentication is a separate adapter. It requires an explicit
random `DEV_ADMIN_KEY` of at least 32 characters and is rejected outside
development.

## Known Risks and Assumptions

- Live Supabase, Vercel, and external OIDC behavior remains unverified because
  approved values are not visible to the execution session.
- Current roles are application-enforced; Supabase row-level security is not the
  authorization boundary for Prisma connections.
- The provider-issued database role must be least-privileged and isolated by
  environment.
- AI, payments, private document storage, notifications, and live booking
  providers are not implemented or approved.
- Legal and multilingual publication gates remain open.

## Conditional Capability Inventory

- Email: no live email provider; no `emails.md`.
- Scheduled work: no cron/background scheduler; no `cron.md`.
- SEO: the current preview is `noindex`; no production SEO workflow.
- Automation/AI: controlled guidance exists and future AI integration is gated;
  see `automation.md`.

## Related Documents

- `flows.md`
- `permissions.md`
- `variables.md`
- `tests.md`
- `automation.md`
- `../docs/environment-secrets-audit-report.md`
- `../docs/vercel-supabase-migration-report.md`
