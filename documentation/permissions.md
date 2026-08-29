# Permissions
## Role Source

The user role is stored in PostgreSQL and added to the Auth.js session by the
server callback. Authorization is enforced in server routes. Browser state is
not an authorization source.

## Role Summary

| Role | Intended capabilities |
|---|---|
| `PUBLIC_USER` | Read public catalog and start controlled guidance |
| `CUSTOMER` | Public capabilities plus booking creation and own order access |
| `SUPPORT` | Booking/order support reads |
| `CONTENT_EDITOR` | Draft service content |
| `TRANSLATOR` | Draft translations |
| `LEGAL_REVIEWER` | Approve service and knowledge content |
| `AI_REVIEWER` | Review AI evaluations/issues |
| `OPERATIONS_ADMIN` | Manage bookings and orders |
| `PRIVACY_ADMIN` | Privacy operations and audit reads |
| `PLATFORM_ADMIN` | All application permissions |

## Resource Matrix

| Resource / operation | Public | Customer | Specialist roles | Platform admin |
|---|---:|---:|---:|---:|
| Published services read | Allow | Allow | Allow | Allow |
| Draft service versions read/write | Deny | Deny | Content/legal roles as implemented | Allow |
| Booking create | Current public development route | Allow when authenticated architecture is completed | Operations read/manage | Allow |
| Booking status/payment reconcile | Deny | Deny | `OPERATIONS_ADMIN` | Allow |
| Preliminary assessment submit | Allow, constrained | Allow | Allow | Allow |
| Assessment queue/review | Deny | Deny | Legal reviewer when route policy is expanded | Allow currently |
| Audit read | Deny | Deny | `PRIVACY_ADMIN` policy target | Allow currently |
| Launch/admin configuration | Deny | Deny | Permission-specific future target | Allow currently |

## Database Authorization

Prisma uses a server-side database role. Supabase row-level security is not the
current application authorization mechanism. The database credential must
therefore be least-privileged, environment-specific, and unavailable to the
browser. Application RBAC remains mandatory at every protected server route.

## Open Permission Work

- Replace broad `PLATFORM_ADMIN` checks with the existing permission matrix
  where routes support specialist roles.
- Add resource ownership checks for customer bookings/orders before enabling
  customer accounts.
- Define least-privileged migration and runtime database roles.
- Add periodic role review and emergency access revocation procedures.
