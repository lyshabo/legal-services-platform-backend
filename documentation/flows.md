# Security and Operations Flows
## Public Catalog

- Actor: unauthenticated visitor.
- Precondition: none.
- Sequence: browser requests `/api/services`; server repository selects only
  published service versions; Prisma reads PostgreSQL when enabled.
- Authorization: public read only; unpublished versions are excluded.
- Deny case: draft or `IN_REVIEW` records do not appear.
- Side effects: none.

## OIDC Sign-In and Session

- Actor: approved identity-provider user.
- Precondition: approved OIDC configuration and registered `AUTH_URL`.
- Sequence: browser requests Auth.js sign-in, provider authorization uses PKCE,
  state, and nonce, callback links account, Prisma stores session, browser
  receives HttpOnly cookie.
- Authorization: protected API routes load the database session and verify role.
- Deny case: missing email, invalid callback state, absent session, or
  insufficient role.
- Side effects: user/account/session writes.

## Development Sign-In

- Actor: local developer only.
- Precondition: `APP_ENV=development`, `AUTH_ADAPTER=dev`, explicit
  `DEV_ADMIN_KEY` with at least 32 characters.
- Sequence: password field posts to `/api/auth/dev-login`; constant-time key
  comparison; in-memory session and audit event.
- Deny case: missing/weak key, wrong key, or any non-development environment.
- Side effects: development session and audit record only.

## Database Migration and Preview Deployment

- Actor: authorized GitHub workflow dispatcher.
- Precondition: protected `master` environment and complete CI variables.
- Sequence: structural/TLS preflight, OIDC discovery, Prisma validation,
  migration hashes, `migrate deploy`, status check, gated preview fixture seed,
  `SELECT 1`, live contracts, Vercel configuration, preview deployment and
  inspection.
- Authorization: GitHub environment controls and Vercel token.
- Deny case: any missing variable stops before database or deployment jobs.
- Side effects: schema changes, gated fixture data, Vercel environment changes,
  preview deployment.

## Booking and Payment

- Actor: public user for booking; administrator for status/reconciliation.
- Precondition: supported service/slot and server validation.
- Sequence: server transaction locks slot, creates booking/status history,
  reconciles idempotent payment records, and writes audit events.
- Authorization: administrative actions require server-side role checks.
- Deny case: unavailable slot, duplicate/conflicting idempotency key, invalid
  status, or unauthenticated administrator.
- Side effects: booking, slot, payment, history, and audit writes.
- Current limitation: live provider adapters and real payments are disabled.

## Preliminary Legal Assessment

- Actor: public submitter and authenticated reviewer.
- Precondition: language, jurisdiction, issue, urgency, and supported-state
  validation.
- Sequence: constrained public submission, server persistence, authenticated
  queue review, audited status transition.
- Authorization: public users cannot approve; reviewer role is required.
- Deny case: unsupported jurisdiction, missing information, or unauthorized
  review.
- Side effects: assessment and audit writes.
