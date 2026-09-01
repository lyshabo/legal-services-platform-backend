# Initial Threat Model

## Protected Assets

- User identity and account data.
- Intake answers and uploaded documents.
- Booking details.
- Orders and payment state.
- Digital product access.
- Approved knowledge sources.
- AI prompts, retrieval records, outputs, and evaluations.
- Administrative permissions and audit history.

## Principal Threats

- Unauthorized access to sensitive submissions.
- Insecure direct object references.
- Privilege escalation.
- Payment or booking callback replay.
- Malicious file uploads.
- Cross-site scripting and injection.
- Secret leakage.
- Excessive analytics or logging.
- Prompt injection and restricted-source exfiltration.
- Knowledge-source poisoning or stale content.
- Fabricated authorities or unsupported AI conclusions.
- Publishing unverified credentials, products, prices, or claims.

## Current Controls

- No production sensitive-data collection.
- Localhost-only server.
- Restrictive content security and framing policies.
- HTML escaping before rendering data.
- No inline script or third-party code.
- Deterministic guidance scope and source checks.
- Explicit fixture and provider modes.
- Production-readiness blocker report.

## Required Before Sensitive Data

- Server-side authentication and authorization.
- Relational data constraints and tenant/object access checks.
- Encryption and managed secrets.
- Private object storage with upload validation and malware scanning.
- Audit events and security monitoring.
- Rate limiting and abuse controls.
- Backup/restore testing.
- Incident-response integration.
- Provider security and privacy review.
- Application and penetration testing appropriate to the deployed architecture.
