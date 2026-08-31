# Verification Checklist

## Environment

- [ ] Docker and Docker Compose resolve.
- [ ] PostgreSQL health check passes.
- [ ] Application port and process ownership are known.
- [ ] Secrets are supplied through environment variables, never committed.
- [ ] Every variable is classified by runtime, CI/CD, migration,
      authentication, optional, or incorrectly-required scope.
- [ ] Development, Preview, and Production use separate credentials.
- [ ] Runtime, migration-only, CI-only, protected configuration, and public
      configuration are separated.
- [ ] Example environment files contain names only, without placeholders or
      fixed development credentials.
- [ ] Git-tracked files pass credential-pattern and weak-default scanning.
- [ ] Built public assets contain no server-only names or credential patterns.
- [ ] Missing approved values stop preflight before migration or deployment.

## Prisma

- [ ] `prisma generate` passes.
- [ ] `prisma validate` passes.
- [ ] Checked-in migration is applied with `prisma migrate deploy`.
- [ ] Seed is idempotent and creates required development records.
- [ ] Live contract tests run against the intended database.

## Authentication

- [ ] Development login requires both development environment and dev adapter.
- [ ] Auth.js/OIDC fails closed when required values are missing.
- [ ] PKCE, state, and nonce checks are enabled.
- [ ] OAuth accounts link to users.
- [ ] Database sessions survive a new request or process.
- [ ] Sign-out invalidates the session and clears cookies.
- [ ] Every admin/API mutation enforces server-side role or permission checks.
- [ ] Real-provider evidence is distinguished from local or test-issuer
      evidence.

## Transactions

- [ ] Version increments cannot collide under concurrent writes.
- [ ] Only one concurrent request can claim a slot.
- [ ] Payment reconciliation is idempotent.
- [ ] Booking, slot, payment, history, and audit state stays consistent.
- [ ] Administrative status changes release or claim slots appropriately.

## Browser

- [ ] Public routes render.
- [ ] Language switching updates visible content.
- [ ] Filters narrow results.
- [ ] Guidance refuses unsupported scope and escalates urgency.
- [ ] Contact validation catches invalid input.
- [ ] Admin versioning, availability, booking status, reconciliation, audit
      filters, and launch controls work.

## Defect review

- [ ] Complete changed-file diff reviewed.
- [ ] P0/P1 findings fixed and covered by regression tests.
- [ ] No destructive reset is reachable outside explicit development.
- [ ] `npm audit --audit-level=moderate` is clean or exceptions are documented.
- [ ] Production readiness remains blocked until real approvals exist.

## Infrastructure evidence

- [ ] Configuration presence checks do not print secret values.
- [ ] Database URLs require approved remote TLS endpoints.
- [ ] Direct migration credentials are absent from application runtime.
- [ ] CI deployment credentials are absent from application runtime.
- [ ] Migration, seed, connectivity, live contracts, OIDC flow, and deployment
      each have an independent `PASS`, `FAIL`, `SKIP`, `BLOCKED`, or `NOT RUN`
      result.
- [ ] Every blocked item names its owner, blocking effect, and exact next
      action.
- [ ] GitHub workflow status is tied to the exact commit and run ID; no run is
      reported as `NOT RUN`, not as success or failure.

## Skywork AI Editor prompt execution

- [ ] Generated live-verification prompt was opened and reconciled with the
      current repository and commit.
- [ ] Prompt-required variable names, scopes, and non-disclosure rules were
      confirmed.
- [ ] Secret-channel values were checked by presence, scope, and length only.
- [ ] GitHub environment configuration was changed only when the complete
      approved set was observable.
- [ ] The current workflow was dispatched only after preflight prerequisites
      passed.
- [ ] Every workflow job and step has an independent result and evidence row.
- [ ] External OIDC evidence uses an approved provider and interactive test
      identity, not a local test issuer.
- [ ] Prompt stop conditions were honored when prerequisites were absent.
- [ ] Final reports separate local, GitHub, live-provider, and governance
      evidence.

## Mirrored GitHub Pages and static demo

- [ ] Dedicated static-demo repository, remote, branch, Pages workflow, and
      expected URL are identified.
- [ ] Mirrored diff contains only intended static-demo and localization changes.
- [ ] Static-demo patch checks and available regression tests pass.
- [ ] Source commit SHA and push result are recorded.
- [ ] Pages workflow run is queried for that exact commit.
- [ ] Workflow, deploy job, artifact, and deployment URL results are recorded
      independently.
- [ ] Public URL returns the expected HTTP status and deployed asset.
- [ ] JavaScript-rendered labels and links are verified in deployed assets or
      through browser rendering.
- [ ] Link destination exactly matches the approved URL.
- [ ] External links use `target="_blank"` and `noopener noreferrer` where
      required.
- [ ] `ETag`, `Last-Modified`, `Cache-Control`, `Age`, and cache-status headers
      are captured without exposing secrets.
- [ ] A second fetch distinguishes fresh deployment from cached propagation.
- [ ] Static-demo browser regression results remain separate from backend,
      Vercel, database, and external OIDC evidence.
- [ ] A push is not called a deployment until the Pages workflow succeeds.
- [ ] Every top-level GitHub Action uses a full immutable commit SHA.
- [ ] Pinned action metadata was inspected and every consumed output name was
      validated exactly.
- [ ] The Pages upload path is a curated static directory, never `.` or the
      repository root.
- [ ] Expected artifact files are enumerated and unintended source, dependency,
      environment, report, test-output, and log files are excluded.
- [ ] Curated files have deterministic SHA-256 evidence.
- [ ] The uploaded artifact's ID, name, size, formal `sha256:` digest, and
      download endpoint are recorded from the Actions API.
- [ ] Artifact integrity, workflow execution, deployment, and CDN propagation
      are reported as separate evidence layers.
- [ ] French, Simplified Chinese, and Traditional Chinese source and test files
      pass strict UTF-8 decoding.
- [ ] Browser assertions cover localized filter labels, detail-route headings,
      gated messages, disabled controls, and `<html lang>`.
- [ ] Locale selection remains stable while navigating from a listing to a
      detail route.
- [ ] Route assertions wait for route-specific state and use unambiguous
      accessible locators.

## Narrative About page

- [ ] The profile leads with identity, focus, experience, and value rather than
      a chronological credential list.
- [ ] The exact approved full name appears in identity fields and headings.
- [ ] The approved surname or short-name rule is used consistently in prose.
- [ ] Public copy contains no CV/resume source references or disallowed name
      variants.
- [ ] Credential, admission, client, employer, publication, and experience
      claims are source-supported and are not exaggerated.
- [ ] Resolved credential decisions remain resolved without stale verification
      requests.
- [ ] Identity, regulated-title, image-rights, publication-permission, and
      translation gates remain fail closed where unresolved.
- [ ] Publication evidence metadata, disclaimers, `noindex`, and launch gates
      remain intact.
- [ ] English, French, Simplified Chinese, and Traditional Chinese narratives
      contain equivalent facts and correct locale-specific labels.
- [ ] Education and selected experience details remain accessible through
      usable disclosures.
- [ ] Contact and consultation CTAs lead to the intended routes.
- [ ] The dedicated static-demo copy and presentation match the reviewed main
      implementation without adding backend capabilities.
- [ ] Focused Playwright assertions cover titles, paragraph count, identity,
      disclosures, credential status, publication controls, CTAs, `noindex`,
      locale switching, and mobile overflow.
- [ ] Fresh desktop and mobile screenshots exist for all four locales and were
      reviewed for wrapping, encoding, disclosure fit, CTA stacking, portrait
      rendering, horizontal overflow, and gate retention.
- [ ] Main and static-demo changes are committed separately after staged-diff
      review, with unrelated workspace files excluded.

## Claim integrity and qualified review

- [ ] Every express and implied claim has a stable ID.
- [ ] Summary-category totals equal the detailed claim count.
- [ ] The claim-evidence matrix records exact wording, lower-risk wording,
      evidence, owner, reviewer, location, permission, due date, decision,
      sign-off, revalidation, blocking effect, and notes.
- [ ] Missing names, evidence, permissions, and dates remain `Not supplied`.
- [ ] Lower-risk wording is synchronized across English, French, Simplified
      Chinese, and Traditional Chinese without introducing new claims.
- [ ] Resolved credentials, evidence metadata, `noindex`, jurisdiction limits,
      disclaimers, and publication gates remain intact.
- [ ] Edited source, tests, matrix, and sign-off documents decode as strict
      UTF-8 and contain no U+FFFD or known mojibake sequences.
- [ ] Representative French, Simplified Chinese, and Traditional Chinese terms
      are checked against exact source strings or code points.
- [ ] Each locale has a separate qualified-review record with reviewer name,
      qualification, target region, terminology decisions, version, decision,
      review date, sign-off date, and conditions.
- [ ] Automated rendering and synchronized copy are not described as qualified
      translation approval.
- [ ] Main and mirrored repositories have separate commit, remote branch, push,
      workflow, artifact, deployment, and CDN evidence.
- [ ] The nested static-demo repository is never staged in the parent.
- [ ] A push is not described as a deployment without workflow and public-asset
      evidence for the exact commit.

## DOCX-driven multilingual services

- [ ] The supplied DOCX was extracted locally and its requested service list
      was mapped to the existing taxonomy, routes, filters, and gate model.
- [ ] Requested, preserved, added, merged, and cross-cutting categories are
      reconciled explicitly; the final category count is internally consistent.
- [ ] English, French, Simplified Chinese, and Traditional Chinese records each
      contain title, summary, audience, included scope, and exclusions.
- [ ] Filter, card, and detail labels are localized and no internal category
      slug is displayed publicly.
- [ ] New service records remain fixtures with evidence pending, booking
      disabled, and production publication blocked.
- [ ] Representation, expert-witness, consultancy, environmental, and ESG
      wording does not imply authorization, appointment, admissibility,
      certification, approval, assurance, deadline protection, or outcomes.
- [ ] The approval record identifies service owner, legal reviewer, required
      qualifications, jurisdictions, conflicts controls, engagement terms,
      evidence location, permission, decision, and sign-off date.
- [ ] The browser-only mirror matches reviewed content without gaining backend,
      authentication, database, booking, payment, provider, or confidential
      submission capabilities.
- [ ] Browser tests cover all four locale labels, category filtering, cards,
      detail routes, fixture/evidence state, exclusions, required subject
      wording, and disabled controls.
- [ ] Syntax, strict UTF-8/mojibake, unit, main Playwright, and named
      static-demo regression results are recorded independently.
- [ ] Main and static-demo commits are separate, staged diffs are inspected,
      unrelated hunks are excluded, and the nested mirror is not staged in the
      parent repository.
- [ ] Automated checks are not represented as qualified legal, service-scope,
      jurisdiction, or translation approval.

## Narrow approvals and single-path Pages

- [ ] Approval records and skill source are staged by exact path and the cached
      file list contains no packaged skill, unrelated code, report, or artifact.
- [ ] Missing authenticated approver names, authority bases, decisions, and
      actual sign-off dates remain explicitly blocked and unsigned.
- [ ] The Pages run is tied to the exact source commit and every workflow/job
      conclusion is recorded.
- [ ] Artifact name, ID, size, expiry, download endpoint, and formal
      API-provided `sha256:` digest are captured.
- [ ] Two or more deployed-URL requests record status, final URL, `ETag`,
      `Last-Modified`, `Cache-Control`, `Age`, cache status, and hit count.
- [ ] Stable validators and cache progression or revalidation are confirmed.
- [ ] Pages `build_type`, checked-in workflows, and all exact-commit runs are
      compared for duplicate legacy and Actions deployment paths.
- [ ] Exactly one authoritative Pages path remains configured.
- [ ] When Actions is selected, a fresh workflow run succeeds without a new
      legacy Pages run for the verification commit.
- [ ] Push, workflow, artifact, deployment, public-content, and CDN evidence are
      reported as independent layers.
