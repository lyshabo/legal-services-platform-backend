# Variables and Secrets
## Inventory

| Name | Used by | Scope | Source | Rotation / change control | Risk |
|---|---|---|---|---|---|
| `VERCEL_TOKEN` | GitHub deployment workflow | CI secret | Vercel administrator | Rotate on staff/tool change or suspected exposure | Can deploy and mutate project configuration |
| `VERCEL_ORG_ID` | Vercel CLI | CI configuration | Vercel project record | Review on project transfer | Misroutes deployment |
| `VERCEL_PROJECT_ID` | Vercel CLI | CI configuration | Vercel project record | Review on project replacement | Misroutes deployment |
| `DATABASE_URL` | Prisma runtime/contracts | Server secret | Supabase pooler | Rotate independently per environment | Database access and confidential data |
| `DIRECT_URL` | Prisma migrations | Migration secret | Supabase direct endpoint | Rotate independently; restrict privileges | Schema/data administration |
| `AUTH_SECRET` | Auth.js | Server secret | Approved secret generator/manager | Rotate with session invalidation plan | Session/token compromise |
| `AUTH_URL` | Auth.js origin normalization | Server configuration | Approved Vercel/custom origin | Change only with callback registration | Callback/cookie misbinding |
| `OIDC_ISSUER` | Auth.js OIDC | Server configuration | Identity administrator | Change only through IdP migration | Trusts wrong issuer |
| `OIDC_CLIENT_ID` | Auth.js OIDC | Server configuration | Identity administrator | Review with client registration | Wrong client/audience |
| `OIDC_CLIENT_SECRET` | Auth.js OIDC | Server secret | Identity administrator | Rotate per IdP policy | Client impersonation |
| `DEV_ADMIN_KEY` | Development adapter | Development secret | Local approved secret mechanism | New random value per developer/session where feasible | Local admin access |
| `CLAUDE_API_KEY` | Future model adapter | Server secret | Approved AI provider | Rotate per provider/security policy | Confidential prompt/data access and spend |
| `STRIPE_SECRET_KEY` | Future payment adapter | Server secret | Approved payment provider | Rotate per provider/security policy | Financial operations |
| `STRIPE_WEBHOOK_SECRET` | Future webhook verification | Server secret | Approved payment provider | Rotate with dual-secret transition | Forged payment events |

## Client-Bundle Boundary

No variable in the secret rows may use a public/client prefix or be copied into
`index.html`, `app.js`, `data.js`, `i18n.js`, `platform-core.js`, or `styles.css`.
The Vercel build copies only those six public assets. `npm run secrets:audit`
scans the resulting bundle for audited secret names and credential patterns.

## Environment Policy

- Development, preview, and production use separate values.
- Production secrets are never copied into development or preview.
- Even development database, authentication, AI, payment, and webhook
  credentials are managed as secrets rather than committed defaults.
- `DIRECT_URL` exists only where migrations run.
- AI/payment secrets remain absent while their adapters are disabled.
- GitHub secrets and Vercel secrets are entered through provider controls, not
  chat, source files, workflow YAML values, screenshots, or logs.

## Pre-Go-Live Checklist

- [ ] Environment-specific Supabase runtime and migration roles approved.
- [ ] Auth.js secret generated and rotation plan recorded.
- [ ] OIDC client/callback/logout origins approved and verified.
- [ ] GitHub protected environment has required secrets and branch controls.
- [ ] Vercel runtime contains only runtime values, not `DIRECT_URL` or token.
- [ ] AI/payment/storage secrets absent until corresponding provider approval.
- [ ] Public bundle and Git secret scans pass.
- [ ] Incident response and credential rotation owners named.
