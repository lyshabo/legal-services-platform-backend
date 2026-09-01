# Implementation Status

## Current Phase

Phase 0 foundation and governance plus the PostgreSQL/Auth.js transition and
the booking-administration vertical slice.

## Completed Capabilities

- Dependency-light browser application and local HTTP server.
- Responsive public shell with accessible navigation.
- English, French, and Chinese localization.
- Service and legal-library discovery, filters, and detail routes.
- Explicit development fixtures for unknown services and products.
- Development booking adapter and local-only contact validation.
- Controlled preliminary-guidance routing:
  - mandatory jurisdiction and topic;
  - approved-source matching;
  - unsupported-scope refusal;
  - urgency escalation;
  - structured qualified output;
  - source metadata display.
- Browser-local launch-gate tracker.
- Server-side development persistence for versioned services and translations.
- Development-only authenticated admin session with server-side role checks.
- Append-only development audit events for login and service-version creation.
- Validated Prisma/PostgreSQL schema and generated initial migration SQL.
- Auth.js-compatible callbacks, RBAC policy, and Prisma session/user adapter contract.
- Environment-driven OIDC provider configuration with production rejection of the local development adapter.
- Auth.js Core HTTP runtime bridge for OIDC sign-in, callback, database
  sessions, sign-out, and server-side RBAC.
- Prisma OAuth account-linking fields and adapter methods required for OIDC persistence.
- Versioned questionnaire API with required-answer validation.
- Prisma-backed questionnaire versions, exact-version submissions, and answers.
- Time-zone-aware development booking-slot API.
- Prisma-backed availability, slots, bookings, status history, and payments.
- Serializable transactions and row locking for versioning, slot claims, and reconciliation.
- Admin management for questionnaire versions, availability, booking status, payment reconciliation, and audit filters.
- Localhost-only PostgreSQL Compose definition, migration runbook, expanded seed, and live-database contract suite.
- Provider interfaces for booking and payment.
- Playwright end-to-end coverage for the primary public and admin workflows.
- Automated production-readiness evaluator.
- Pure-logic automated tests.
- Defect-first hardening for Prisma booking status serialization, transactional
  availability auditing, and server-side time-zone validation.
- Payment reconciliation now rejects idempotency-key reuse across bookings and
  validates status, amount, and currency inputs at the trusted boundary.
- Homepage and About positioning now use supplied International Legal &
  Dispute Resolution source copy, and the Services catalog includes the supplied
  international arbitration, investment law, cross-border business, extractive
  industries, business and human rights, AfCFTA/trade, and international
  research service areas.
- Conservative French, Simplified Chinese, and Traditional Chinese working
  translations now cover the new homepage, profile, and international-service
  content. They remain machine-marked `in_review`, without qualified-review
  approval, and the localization launch gate remains open.
- The homepage hero now uses the lower-risk phrase “Strategic Insight.”
- The About route now presents source-based profile narrative, an Areas of
  Expertise strip, and a Thought Leadership & Recognition review section.
  Publications, conferences, recognition, professional development, and a
  bar-admission status lead remain pending documentary verification and
  publication permission.
- The public library is now labeled “Legal Library” and presents gated legal
  resources, research guides, and publications rather than sales-oriented
  product listings. Resource availability, licensing, pricing, and publication
  remain pending approval.
- The Legal Library fixture catalog now includes eight gated resources spanning
  international arbitration, investment law, African trade and AfCFTA, business
  and human rights, extractive industries, international economic law, and
  legal research, with English, French, Simplified Chinese, and Traditional
  Chinese metadata.

## Validation

Latest validation on August 28, 2026:

- `npm.cmd run validate` passed.
- 16 automated core/domain/auth tests passed and 1 live-database test skipped because PostgreSQL was unavailable.
- Application syntax checks passed.
- Local HTTP server returned `200` on `http://127.0.0.1:4173`.
- Headless browser smoke checks rendered the homepage, services route, and guidance route at desktop/mobile sizes.
- `npx.cmd playwright test` passed all 8 browser tests.
- `npm.cmd run prisma:validate` passed.
- `npm.cmd audit --audit-level=moderate` reported zero vulnerabilities.
- Live browser walkthrough verified home, services, library, guidance, launch
  controls, service version/audit creation, booking hold creation, and payment
  reconciliation.
- Anonymous access to the admin bookings API returned `401`.
- Production startup rejected `AUTH_ADAPTER=dev`.
- Auth.js startup rejected incomplete OIDC/database configuration.
- Production readiness intentionally reports `BLOCKED` because required approvals and live providers are absent.

Use:

```powershell
npm.cmd run validate
```

## Known Limitations

- PostgreSQL persistence is implemented but was not activated on this machine.
- No approved external identity-provider credentials; the local session adapter
  remains development-only.
- JSON and in-memory persistence remain explicit development fallbacks.
- Docker, PostgreSQL, and `psql` were not installed or available on August 27,
  2026, so the checked-in migration and seed could not be applied to a live
  database and the database contract test remains unexecuted.
- The Auth.js runtime was verified against a local OIDC test issuer. A real
  external identity-provider run still requires approved issuer and client
  credentials.
- No live payment, calendar, notification, storage, analytics, or model provider.
- No approved professional identity, jurisdiction, service, product, price, policy, or meaning-sensitive translation.
- Guidance uses deterministic development behavior and one explicitly development-only source record.
- Administrative gate changes are local browser state and are not approvals.

## Remaining Launch Gates

- Operating entity and professional identity.
- Professional and user jurisdictions.
- Services, engagement, conflict, eligibility, fee, cancellation, and support rules.
- Data map, retention, notices, rights workflows, and privacy review.
- Production security threat model and controls.
- AI use cases, content sources, provider, evaluation thresholds, retention, and monitoring.
- Products, prices, taxes, licenses, refunds, and payment provider.
- Legal Library resource scope, publication status, licensing, and any future
  commercial model.
- Qualified review of French and Chinese meaning-sensitive content.
- Qualified review of Traditional Chinese meaning-sensitive content and
  confirmation of target regions.
- Production vendors and processing locations.

## Recommended Next Vertical Slice

Install or provision PostgreSQL, run the documented Compose/migrate/seed/test
sequence against the live database, then exercise the Auth.js runtime against
the approved external OIDC provider and replace the development booking and
payment providers.
