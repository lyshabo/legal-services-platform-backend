# Verification Map

## Existing Coverage

| Use case | Rule and negative case | Evidence | Status |
|---|---|---|---|
| Development authentication | Dev adapter rejected outside development | `tests/auth-config.test.mjs`, `server-auth.mjs` | Existing |
| Development secret | Missing/weak `DEV_ADMIN_KEY` rejects server startup | `tests/auth-config.test.mjs` | Existing |
| OIDC construction | Provider exists only with complete issuer/client configuration | `tests/auth-config.test.mjs` | Existing |
| OIDC callback/session/RBAC | Local test issuer covers callback, persisted adapter session, allow/deny role checks | `tests/auth-runtime.test.mjs` | Existing, not external |
| Public service publication | Unpublished service versions never appear in public API | `tests/e2e/platform.spec.mjs` | Existing |
| Database contracts | Booking locks, idempotency, questionnaire and audit behavior | `tests/database-contract.test.mjs` | Existing but guarded live |
| Multilingual/legal safeguards | Navigation, filtering, refusal, escalation, approval metadata, launch gates | `tests/e2e/platform.spec.mjs` | Existing |
| Public secret bundle | Server-only names and credential patterns absent from `dist/` | `scripts/secret-surface-audit.mjs` | Existing command |
| Tracked repository secrets | Credential patterns and weak secret assignments absent from Git-tracked files | `scripts/repository-secret-audit.mjs` | Existing command |
| Workflow secret preflight | Missing values stop before database/deployment jobs | GitHub runs `33262776299`, `33263734979`, `33263816344` | Existing |

## Proposed Tests

| Test type | Rule | Expected negative case |
|---|---|---|
| Guarded live | Supabase runtime and direct endpoints use approved TLS roles | Reject local, non-TLS, wrong environment, or excessive privileges |
| Guarded live | External OIDC sign-in/callback/session/logout | Reject wrong issuer/state/nonce and deny after logout |
| Guarded live | Vercel runtime variable inventory | `DIRECT_URL` and `VERCEL_TOKEN` absent from runtime |
| Automated integration | Provider mode requires corresponding secret only after adapter exists | Disabled provider does not require or consume key |
| Manual review | GitHub/Vercel secret rotation | Old credential revoked and no active session depends on it |
| Manual review | Log inspection | No credential, token, database URL, or confidential intake data |

## Gaps

- No approved Supabase connection has been exercised.
- No external OIDC user/MFA flow has been completed.
- No Vercel preview has deployed successfully.
- No live AI, payment, webhook, storage, notification, or booking provider
  exists to test.
- No automated full Git-history scanner is currently required in CI.
- No tested database-role privilege manifest exists.

The live gaps block production readiness even when local tests pass.
