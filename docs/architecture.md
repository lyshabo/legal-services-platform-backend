# Architecture Overview

## Current Decision

The initial release slice uses a dependency-light browser application served by a small Node.js HTTP server.

Reasons:

- The workspace began without an application, framework, deployment target, provider selection, or database decision.
- Phase 0 and the first Phase 1 slice can be demonstrated without locking the project into unapproved vendors.
- Pure business rules remain separate from rendering so they can move into a future full-stack framework.
- External and sensitive functions remain fail-closed.

## Modules

- Experience: `app.js`, `styles.css`, `index.html`.
- Localization: `i18n.js`.
- Core logic: `platform-core.js`.
- Development configuration and fixtures: `data.js`.
- Integration boundary: provider modes in `data.js`; only deterministic local behavior is enabled.
- Governance: launch gates and production readiness.
- Tests: Node's built-in test runner.

## Security Boundary

The current application does not collect or transmit production personal data. Contact and booking demonstrations remain within the browser.

The local server:

- listens on `127.0.0.1`;
- prevents path traversal;
- disables caching;
- sets content-type protection, referrer policy, frame restrictions, and a restrictive content security policy.

## Future Migration

When deployment, identity, and database decisions are approved:

1. Move pure rules from `platform-core.js` into a shared server/client package.
2. Replace fixture data with versioned relational records.
3. Add server-side authentication and least-privilege authorization.
4. Implement append-only audit events.
5. Add provider adapters for payments, booking, notifications, private storage, search, and models.
6. Preserve fail-closed launch gates and the production-readiness evaluator.
