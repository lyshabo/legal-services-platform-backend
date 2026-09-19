---
name: database-auth-rbac-verification
description: Repeatable full-stack verification workflow for environment-variable classification, secret-surface scanning, CI/runtime/migration scope separation, DOCX-driven multilingual service mapping, Skywork AI Editor live-verification prompts, guarded dispatch, mirrored GitHub Pages publishing, deployed-link and CDN cache verification, static-demo regression testing, Docker Compose PostgreSQL, Prisma migrations and seeds, Auth.js/OIDC sign-in, database sessions, server-side RBAC, transactional repository checks, Playwright browser verification, and fail-closed evidence reporting. Use when a repository needs database-backed authentication, persistence, deployment configuration, legal-service catalog updates, static-demo publishing, secret boundaries, or a prompt-driven live verification run brought up, verified, reviewed, or repaired end to end.
---

# Database Auth Rbac Verification

## Public-site comparison, responsive evidence, and approval gating

Apply this read-only workflow when comparing a deployed browser-only site with
local main and static-demo files before publication:

1. Record the public URL, local commits, configured remotes, and repository
   boundaries. Do not push, deploy, dispatch Pages, or modify unrelated files.
2. Compare deployed assets with static-demo `HEAD` blobs using normalized
   UTF-8/line-ending content and Git object hashes. Separate intentional
   main-versus-mirror differences from unpublished static-demo changes; do not
   classify CRLF/LF normalization as an application difference.
3. Run every public route in every supported locale at representative desktop
   and mobile viewports. Record shell status, `h1`, `<html lang>`, selected
   locale, `noindex`, overflow, broken images, page/console errors, disabled
   transactional controls, and browser-only boundaries.
4. Enumerate rendered HTTP(S) links and assets. Check status, final URL,
   content type, and redirects. Capture Pages `ETag`, `Last-Modified`,
   `Cache-Control`, `Age`, cache status, and hit counts.
5. When an evidence URL returns `404`, DNS failure, automated `403`, or cannot
   be independently validated, remove its rendered hyperlink rather than
   substituting an unverified URL. Preserve the citation, source title,
   identity-match status, and publication-permission gate as pending.
6. Prepare a publication checklist in the requested language. Assign
   role-based action owners when authenticated names are unavailable and give
   a reproducible evidence location, action, decision, review date, sign-off
   date, and blocking effect for every approval row.
7. Keep publication fail closed until legal claims, identity, jurisdiction,
   qualified translation, privacy, security, AI, commerce, provider,
   image-rights, accessibility, source-currentness, and publication approvals
   are signed. A passing browser audit or CDN response is technical evidence,
   not human approval.
8. Re-run the local corrected mirror and the unchanged public deployment
   separately. State explicitly that local fixes are unpublished until an
   approved push, Pages run, exact artifact, and public content check prove
   deployment.
9. Produce a focused synchronization plan for Home, Legal Library, Guidance,
   Booking, and multilingual About differences. Identify the source of truth,
   owner, evidence, locale review, tests, and stop condition for each section.

## Latest Auth.js and secret-channel controls

Apply these additional checks whenever the repository implements Auth.js,
Prisma-backed sessions, or a guarded live-verification prompt:

1. Verify that `/api/auth/*` is mounted through the actual HTTP server and that
   Web `Request`/`Response` conversion preserves status, body, and every
   `Set-Cookie` header.
2. Verify the Prisma adapter contract for user, account, and database-session
   CRUD, including account lookup by `(provider, providerAccountId)`, persisted
   role projection, expiry handling, and safe deletion of missing records.
3. Require PKCE, state, and nonce checks, an approved HTTPS issuer outside an
   explicitly gated localhost test mode, a required profile email, and a
   trusted configured origin. Never treat a local signed issuer as external
   provider evidence.
4. Exercise the complete session lifecycle: sign-in redirect, callback,
   persisted session retrieval, reviewer/admin allow, client deny, logout,
   cookie clearing, session deletion, and post-logout denial.
5. Recheck approved secret-channel variables by name, scope, presence, and
   length only. The minimum map is
   `TEMP_FORWARD_TEST_GH_TOKEN`, `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
   `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`. Never echo,
   interpolate, persist, or include their values in reports, workflow logs,
   browser output, or source control.
6. Stop live execution independently when a required variable is absent.
   Mark GitHub publication, database migration/seed/connectivity/contracts,
   or external OIDC as `BLOCKED`/`NOT RUN`; do not substitute localhost,
   placeholders, test issuers, or browser-only evidence.
7. During defect-first review, prioritize unauthenticated protected routes,
   unawaited RBAC/session checks, development-login reachability outside
   development, non-persistent sessions, missing cookie invalidation, adapter
   uniqueness/idempotency errors, and inconsistent transaction boundaries.
8. Update the evidence report with exact date, commit, command, independent
   result, environment mode, adapter selection, owner, blocker, and next action.
   Preserve local, live database, external provider, GitHub Pages, and
   governance evidence as separate layers.

## Evidence-sourced multilingual About-page redesign

When a supplied CV and About-page redesign brief are in scope:

1. Inspect the existing About route, navigation, typography, responsive layout,
   image assets, language architecture, and current credential/evidence gates
   before editing unrelated pages.
2. Treat authenticated supplied materials as the authoritative source for
   names, titles, education, memberships, experience, languages, publications,
   and training. Do not upgrade a candidate status into a completed degree or
   infer bar admission, current authorization, clients, outcomes, or
   affiliations.
3. Prefer lower-risk descriptors such as `legal researcher`, `international law
   specialist`, or `dispute-resolution specialist` until regulated-title and
   current-status approvals are documented.
4. Build a concise portrait-led profile with education, selected experience,
   approach, languages, and clearly gated Bar Memberships & Admissions.
   Provide structural, unnamed Counsel and Board of Advisors sections rather
   than fictional people or credentials.
5. For every credential or experience item, record source title, source type,
   identity-match status, and publication-permission status. Keep production
   publication closed while any field is pending.
6. Select only an authentic supplied photograph. Record provisional selection,
   likeness confirmation, rights/permission, crop, and approved accessible
   alt text as separate checks.
7. Preserve English, French, Simplified Chinese, and Traditional Chinese as
   separate review tracks. Require qualified reviewer, target region,
   terminology decisions, and sign-off date for each translated section.
8. Add responsive browser tests for portrait loading, one page-level H1,
   education/experience counts, gated bar status, empty counsel/advisor
   structures, CTA routes, `noindex`, all four locales, and mobile overflow.
9. Run a claim-by-claim marketing review. Classify each phrase as factual,
   implied, regulated, comparative, or absolute; map it to evidence; rewrite
   unsupported wording; and list the exact owner action needed to clear it.
10. Report CV incorporation, page redesign, education, bar, experience,
    counsel, advisors, photograph, multilingual, responsive, and factual
    integrity results independently. Never call the page production-ready
    while identity, credential, jurisdiction, translation, rights, or
    publication approvals remain open.

### About.docx multilingual content review

When `About.docx` is supplied or the About page is refreshed from a document:

1. Extract the document text with the document-editing workflow and map each
   proposed sentence to a source-supported fact. Do not infer bar admission,
   current authorization, clients, outcomes, publication rights, or completed
   academic qualifications from a profile document.
2. Preserve the exact full identity string `Tezzeta N’gungwa Mbuya` in
   display-name, title, metadata, and other identity fields. In prose
   sentences, use `Mbuya` only; do not use `Tezzeta`, `Tezzeta Mbuya`, or the
   full name as the sentence subject.
3. Remove public About-section references to CVs, resumes, curricula vitae,
   supplied-CV context, or equivalent translated wording. Replace each
   sentence with direct, neutral, source-supported language.
4. Keep English, French, Simplified Chinese, and Traditional Chinese as
   independent tracks with correct script, punctuation, `<html lang>`,
   evidence metadata, publication warnings, and `noindex`.
5. Run a claim-by-claim legal-marketing review for descriptors, academic
   status, institutions, bar or regulated credentials, experience, expertise,
   geography, and CTAs. Classify each claim, map evidence, and assign the
   owner action needed for clearance.
6. Require a qualified-translation review for every non-English locale with
   authenticated reviewer name, qualification or authority basis, target
   region, terminology decisions, review date, sign-off date, and status.
   Fluency, machine translation, and browser rendering are not approval.
7. Add focused assertions for identity naming, absence of CV/resume wording,
   gated warnings, translated About headings, evidence metadata, and stable
   education/experience counts.
8. Run strict UTF-8 and mojibake scans, syntax checks, the complete unit suite,
   and the complete Playwright suite. Record exact totals and classify live
   database results separately as `PASS`, `FAIL`, `SKIP`, or `BLOCKED`.
9. Commit only the reviewed About source, required mirrored About source, and
   related tests or review evidence. Exclude unrelated reports, fixtures,
   prompts, secrets, and generated artifacts.

### Resolved Bar Memberships & Admissions workflow

When an authorized reviewer resolves the Bar Memberships & Admissions item:

1. Record the resolution decision, reviewer authority, date, evidence
   location, approved display wording, and affected locale set. Do not infer
   resolution from a user assertion without the repository's designated
   approval record.
2. Update the Bar Memberships & Admissions entry in English, French,
   Simplified Chinese, and Traditional Chinese together. Keep the locale
   structures synchronized and preserve the exact organization name for each
   approved locale.
3. Replace the gated status with the locale-appropriate resolved status only
   after the approval record is present. Remove obsolete bar-status
   verification requests from the rendered entry, but retain unrelated
   authorization, jurisdiction, publication, translation, and evidence gates.
4. If approved wording describes membership, independent-counsel status,
   practice dates, clients, or advice to governments, investors, mining
   companies, or international organizations, run a fresh claim review. Map
   each statement to authenticated evidence and keep any unsupported
   implication gated.
5. Verify exact identity handling: retain `Tezzeta N’gungwa Mbuya` in identity
   fields and use `Mbuya` in prose. Scan all four rendered locale tracks for
   forbidden `Tezzeta`-based sentence subjects and stale CV/resume wording.
6. Run the main app and static-demo locale regression checks. Confirm the
   resolved badge, approved Bar detail, correct `<html lang>`, no mojibake,
   stable About headings, timeline counts, and preserved `noindex` and
   publication warnings.
7. Before committing, inspect `git status` and the staged diff. Stage only the
   reviewed About locale sources, mirrored static-demo source, and directly
   related tests or evidence. Leave unrelated tracked modifications and
   untracked artifacts untouched.
8. Verify the commit with `git show --stat`, `git diff --check`, and a clean
   status check scoped to the committed paths. Report repository-wide dirty
   state separately when unrelated workspace files remain.
9. Run the complete unit and Playwright suites after the synchronized locale
   update. Record exact totals, worker mode, commit, and any guarded live
   database result independently.

### Multilingual walkthrough, evidence requests, and narrow publication

After revising a gated professional About page:

1. Start the local application only with an explicit development
   configuration. Generate any required development key in process memory;
   never commit, print, or reuse it as a production credential.
2. Open the About route in the user's browser and independently walk English,
   French, Simplified Chinese, and Traditional Chinese. Record the rendered
   display name, professional title, hero summary, section headings,
   education/experience counts, current-status badge, and CTA routes.
3. Repeat the walkthrough at a representative mobile viewport. Check portrait
   visibility, heading hierarchy, long translated titles, card/timeline
   density, CTA wrapping, and horizontal overflow. A passing locator test is
   not a visual-layout approval.
4. Assert the lower-risk claim posture in browser tests. In particular, require
   candidate/student wording for an incomplete doctorate and reject
   unapproved regulated-title equivalents in translated hero copy.
5. Create a reviewer-ready evidence-request checklist with stable item IDs,
   exact website wording, acceptable evidence, evidence owner, named reviewer
   or `Name required`, qualification/authority basis, target region, evidence
   location, due date, status, blocking effect, sign-off, expiry, and final
   publication authorization.
6. Keep identity, professional status/jurisdiction, academic credentials,
   institutional experience, expertise claims, image rights, service CTA, and
   each locale in separate approval tracks. Never invent reviewer names,
   evidence, dates, permissions, or target-region approval.
7. When a document skill would send identity, credential, legal, or
   publication-gate information to an unapproved remote service, stop that
   path. Produce the checklist locally in a reviewable format and report the
   privacy-safe fallback; do not bypass the rejection through another remote
   tool.
8. Before committing, run syntax, focused About, full browser, and patch
   checks. Stage exact paths only. Inspect the cached file list and diff
   summary, then commit the main repository and dedicated static-demo
   repository separately.
9. Confirm unrelated modified and untracked files remain outside both commits.
   Record both commit SHAs and exact changed paths. Do not push or publish a
   broader dirty workspace.
10. Push each repository through its configured credential mechanism without
    printing tokens. Verify the exact Pages commit and workflow independently;
    a successful push is not deployment evidence.
11. After Pages succeeds, fetch the deployed shell, About assets, localization
    data, and portrait. Record HTTP status, final URL, `ETag`,
    `Last-Modified`, `Cache-Control`, `Age`, and cache-status headers. Confirm
    the four locale titles and publication gates in the deployed browser.
12. Keep design recommendations distinct from content approval. Recommend
    changes for hierarchy, scan length, spacing, repeated notices, timeline
    density, or CTA placement only when they preserve evidence metadata,
    `noindex`, current-status warnings, and fail-closed publication gates.

### Reviewer evidence, historical deployment, and responsive metadata

Apply these mandatory checks when recording a multilingual About-page review:

1. Replace `Name required`, `Not supplied`, or unsigned approval fields only
   from authenticated reviewer records. Require the reviewer's actual name,
   qualification or authority basis, organization where relevant, target
   region, terminology decisions, review date, sign-off date, decision, and
   reproducible evidence location. Never turn an owner role, proposed due date,
   fluent translation, or user intention to provide data into approval.
2. Preserve historical deployment evidence verbatim. When an earlier push,
   workflow, artifact, deployment, or CDN check was blocked, append a separately
   dated later-success section with its own commit, run, job, artifact digest,
   URL, and headers. Do not rewrite the earlier blocked attempt as successful.
3. Test collapsible evidence metadata independently in English, French,
   Simplified Chinese, and Traditional Chinese. For each locale, verify the
   localized disclosure label, closed default state, expand and collapse
   interaction, evidence-item count, and visible source title, source type,
   identity-match status, and publication-permission status after expansion.
4. Repeat the disclosure checks at representative desktop and mobile
   viewports. Confirm `<html lang>`, long-title wrapping, portrait and CTA
   visibility, no horizontal overflow, and retained `noindex` and publication
   warnings.
5. Measure mobile timeline and experience-row density rather than relying only
   on screenshots. Record viewport, row count, padding or gap, representative
   row heights, and any translated-content outlier. Confirm that mobile
   tightening does not clip text, merge entries, hide gates, or reduce
   accessible touch targets.
6. Inspect focused screenshots or equivalent rendered captures around the hero,
   education timeline, experience timeline, evidence disclosures, and CTA.
   Separate verified defects from optional visual refinements and do not weaken
   evidence or publication controls to shorten the page.

## Overview

Run a fail-closed implementation and verification loop for an application moving
from development adapters to PostgreSQL, Prisma, and Auth.js/OIDC. Preserve
existing repository interfaces and browser behavior while making persistence,
authorization, concurrency, and launch evidence explicit.

## Workflow

### 1. Inspect and gate

1. Read project instructions, package scripts, environment examples, Prisma
   schema/migrations, repositories, authentication modules, API routes, admin
   UI, unit tests, and Playwright tests.
2. Check `docker`, `docker compose`, PostgreSQL tooling, the application port,
   and existing processes before changing anything.
3. Never fabricate provider credentials, legal approvals, jurisdictions, prices,
   or production identity configuration. Keep unknown values gated.
4. Preserve JSON/in-memory adapters only as explicit development fallbacks.
   Reject development adapters outside `APP_ENV=development`.
5. Treat the following as mandatory high-risk checks whenever the repository
   supports them:
   - booking slot claims and administrative status changes use row locks and
     serializable transactions;
   - booking, payment, slot, status-history, and audit writes commit
     consistently;
   - availability rules reject invalid IANA time zones and invalid ranges;
   - production startup fails closed for development authentication, incomplete
     Auth.js/OIDC configuration, and missing database configuration.

### 2. Provision PostgreSQL

1. Add or verify a localhost-only Compose PostgreSQL service with a health check,
   persistent named volume, non-production credentials, and no public bind.
2. Use a documented environment with `DATABASE_URL` and
   `PERSISTENCE_ADAPTER=prisma`.
3. Start the service, wait for health, run `prisma generate`,
   `prisma migrate deploy`, and the seed command. Capture exact results.
4. If Docker is unavailable, still validate the Compose and runbook changes, but
   report migration, seed, and live-contract execution as blocked. Never call a
   skipped test a pass.
5. When a later session reports that Docker Desktop is installed and PostgreSQL
   is reachable, retry the complete sequence rather than relying on prior
   evidence:
   `docker compose up -d postgres`, health check, `prisma generate`,
   `prisma migrate deploy`, seed, and live contracts. Capture each command's
   result independently. A connection error such as Prisma `P1001` is a
   failed retry, not a skip or pass.

### 3. Implement persistence

1. Keep public repository signatures stable while switching on Prisma only when
   both adapter selection and `DATABASE_URL` are present.
2. Support users, sessions, OAuth accounts, services, immutable
   versions/translations, questionnaires/submissions, availability, slots,
   bookings, status history, payments, and audit events.
3. Add unique constraints for idempotency keys and provider account identity.
4. Use serializable transactions and row locks for version increments, slot
   claims, double-booking prevention, payment reconciliation, and status changes.
5. Record audit events inside the same transaction as the state change,
   including availability creation/update and administrative booking status
   changes.
6. Validate status, date, time-zone, amount, and availability inputs at the
   trusted server boundary.
7. Add regression tests for invalid time zones, repeated administrative status
   updates, duplicate payment events, and any fixed transaction-boundary defect.

### 4. Connect Auth.js/OIDC

1. Build a provider only from environment-supplied approved issuer, client ID,
   client secret, and secret key. Fail closed when `AUTH_ADAPTER=authjs` lacks
   required configuration or a database URL.
2. Configure PKCE, state, and nonce checks. Reject profiles without an email.
3. Implement Auth.js adapter methods including `getUserByAccount`,
   `linkAccount`, session CRUD, and user CRUD.
4. Bridge `/api/auth/*` through the actual HTTP server using Web `Request` and
   `Response` objects. Normalize the origin from trusted configuration rather
   than accepting an arbitrary Host header.
5. Persist sessions server-side. Ensure sign-out deletes the persisted session
   and clears secure and non-secure cookie variants where applicable.
6. Add server-side RBAC checks to every protected route. Await every asynchronous
   session and role check.
7. Before attempting a real-provider run, check only for presence and lengths of
   `AUTH_SECRET`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`;
   never print their values. If any are absent, mark external OIDC verification
   blocked and retain only local test-issuer evidence.
8. With approved values present, run a complete sign-in, callback, database
   session persistence, RBAC allow/deny, logout, cookie-clearing, and
   post-logout denial flow. Do not call local issuer tests external-provider
   verification.

### 5. Add contract and browser verification

1. Add a live database contract test that runs only when
   `PERSISTENCE_ADAPTER=prisma` and `DATABASE_URL` are explicitly set.
2. Use isolated test identifiers and cleanup that cannot delete unrelated data.
3. Verify questionnaire versioning, exact-version submissions, availability
   rules, time-zone-aware slots, and concurrent slot claims.
4. Verify booking/payment idempotency, status history, slot release/claim, and
   audit records.
5. Add Auth.js tests for authorization redirect, callback, account linking,
   persisted session retrieval, sign-out, and RBAC.
6. Run Playwright routes and controls for multilingual navigation, filtering,
   guidance refusal/escalation, contact validation, booking, admin versioning,
   availability, booking status, reconciliation, audit filters, and launch gates.

### 6. Perform defect-first remediation

Review the complete change and surrounding call paths before declaring success.
Prioritize:

1. Unauthenticated access to protected routes or mutations.
2. Promise/async authorization checks that are not awaited.
3. Development login or provider fallback reachable outside development.
4. Missing OAuth account linking or non-persistent sessions.
5. Race conditions allowing double booking or inconsistent payment state.
6. Idempotency responses that differ between first and repeated requests.
7. Slot, booking, payment, questionnaire, or audit records left inconsistent.
8. Unsafe reset/cleanup endpoints, unbounded audit queries, or missing input
   validation.
9. Audit writes that occur after a Prisma transaction commits.
10. Booking status updates that read without `FOR UPDATE`, allow duplicate
    history entries for a no-op transition, or can move a booking and slot into
    contradictory states.
11. Availability rules that accept an invalid IANA zone, inverted window, or
    out-of-range minute.

Fix P0/P1 findings before lower-priority cleanup and add a regression test for
each fixed defect. Do not hide failures by weakening tests or silently changing
production defaults.

### 7. Report evidence

Report exact database commands attempted and whether Docker/PostgreSQL was
available; migration, seed, and live-contract results as pass, fail, or
blocked/skip; Auth.js/OIDC test scope; defects fixed and regression coverage;
unit, Prisma, dependency, API, and Playwright results; the application URL and
route walkthrough; and remaining infrastructure or approval requirements.
Use an evidence table or equivalent structured report with one row per check and
one of `PASS`, `FAIL`, `SKIP`, or `BLOCKED`. Include the environment mode,
persistence adapter, authentication adapter, package/version hash when a
skill package is refreshed, and the date of execution. Never collapse a
connection failure into a generic "not run" label.

Never claim production readiness while identity, legal, privacy, security,
jurisdiction, content, or provider approvals remain unresolved.

## Reference

Read [references/verification-checklist.md](references/verification-checklist.md)
for the final evidence checklist.

## Skywork AI Editor live-verification prompt overlay

When a repository has a generated Skywork AI Editor live-verification prompt,
use it as an execution contract layered on top of this workflow:

1. Open the prompt and confirm its fixed repository, commit, workflow,
   environment, adapter selections, latest evidence, required variable map,
   command sequence, stop conditions, result definitions, evidence matrix,
   and final response requirements.
2. Treat the prompt's repository and commit as a baseline to verify, not as
   permission to overwrite newer work. Reconcile it with the current checkout
   and remote branch before making changes.
3. Recheck every approved secret and protected configuration value by name,
   presence, scope, and length only. A user statement that values are
   available is not evidence that they reached the execution process or
   GitHub.
4. Configure the protected GitHub environment only after the complete set is
   observable. Use secure input; never place values in command arguments,
   logs, reports, source control, screenshots, or ordinary chat.
5. Dispatch only the current reviewed workflow from the approved branch.
   Record the exact run ID and commit SHA. Historical runs are not reusable
   evidence.
6. Monitor every job to completion and report preflight, OIDC discovery,
   Prisma validation, migration, seed, connectivity, live contracts, Vercel
   deployment, readiness, and canonical-origin checks independently.
7. Run real Auth.js/OIDC sign-in, callback, session persistence, RBAC,
   logout, and post-logout denial only with approved provider credentials,
   registered callback origin, and an authorized interactive test identity.
8. Run public-bundle and Git-tracked secret scans after the workflow. Confirm
   that migration-only and CI-only values are absent from runtime and browser
   surfaces.
9. Apply defect-first remediation only to evidence-supported P0/P1 issues and
   add regression coverage. Never weaken fail-closed behavior for a green run.
10. Update the environment and migration evidence reports with exact dates,
    commit/run identifiers, independent result statuses, owners, blockers,
    and next actions. Preserve local, GitHub, live-provider, and governance
    evidence as separate layers.
11. If any prerequisite is absent, stop safely and report `BLOCKED` or
    `NOT RUN` according to the prompt's definitions. Never substitute
   localhost, placeholders, test issuers, browser demos, or inferred
   approvals.

## Mirrored GitHub Pages and static-demo overlay

When a repository maintains a browser-only mirror in a dedicated GitHub Pages
repository, treat source publication, workflow execution, deployment response,
and browser behavior as separate evidence layers:

1. Identify the static-demo repository, remote URL, branch, Pages workflow,
   source commit, and expected public URL. Confirm the mirror is separate from
   the private backend repository and do not add demo files to the backend
   commit unless explicitly required.
2. Review the mirrored diff before publication. Include only the intended
   static assets, localization changes, and regression tests. Run patch checks
   and the static-demo test/build command available in that repository.
3. Commit with an exact message and push to the dedicated Pages repository.
   Record the resulting commit SHA and any repository-move or redirect notice.
   Never claim Pages deployment merely because the push succeeded.
4. Query the Pages workflow for the exact commit. Record workflow name, run
   ID, URL, status, conclusion, deploy-job conclusion, artifact name/ID/URL,
   and deployment URL when available. If no run exists yet, record `NOT RUN`
   or `PENDING` according to the observed state.
5. Fetch the public URL after the workflow completes. Verify HTTP status,
   final URL, content type, and the relevant rendered asset or shell. For
   JavaScript-rendered links, inspect the deployed HTML, JavaScript, and
   localization assets separately; do not require client-rendered text in the
   HTML shell.
6. Confirm the deployed link destination exactly matches the approved URL,
   the visible label is present in the deployed localization asset or browser
   rendering, and external links use `target="_blank"` with
   `rel="noopener noreferrer"` when that behavior is intended.
7. Capture CDN evidence without secrets: `ETag`, `Last-Modified`,
   `Cache-Control`, `Age`, `Content-Encoding`, and any provider cache-hit or
   cache-status headers. Repeat the request after a reasonable propagation
   interval and distinguish a fresh origin response from a cached response.
8. Run static-demo regression tests for public navigation, localized labels,
   link destination, locale switching, filters, guidance safeguards, and any
   route affected by the mirrored change. Keep static-demo evidence separate
   from backend/Vercel evidence.
9. Do not call a source commit deployed until the Pages workflow has a
   successful deploy result and the public URL returns the expected asset.
   Do not call a public URL fully propagated until cache headers and a
   post-deploy fetch support that conclusion.
10. Keep `noindex`, publication, legal, privacy, security, provider, and
    localization gates unchanged unless their approvals are separately
    documented. A public static demo is not production legal or
    infrastructure approval.

### Pages artifact integrity and route-stability checks

For a curated Pages fixture or mirror, add these mandatory checks:

1. Pin every top-level action reference to a full immutable commit SHA. Inspect
   the pinned action metadata before relying on an output name; validate exact
   underscore/hyphen spelling such as `artifact_id` versus `artifact-id`.
2. Upload only the explicit static output directory. Enumerate its expected
   files and reject repository-root uploads, dependency folders, tests,
   environment files, reports, logs, source-only server files, and other
   unintended content.
3. Record deterministic SHA-256 values for the curated files. After upload,
   query the Actions artifact API using the action's verified artifact ID and
   require a formal `sha256:` artifact digest, name, size, ID, and download
   endpoint before deployment proceeds.
4. Keep artifact integrity evidence distinct from deployment evidence. A valid
   artifact does not prove a successful Pages deployment, and a deployment
   response does not prove that the expected artifact was uploaded.
5. Validate every localized source and test file as strict UTF-8. Assert
   French, Simplified Chinese, and Traditional Chinese labels directly so
   mojibake, script substitution, and accidental fallback cannot pass.
6. Exercise locale switching followed by hash/history navigation into detail
   routes. Wait for a route-specific heading or state before asserting content,
   then confirm the selected locale, translated gate message, disabled control,
   and `<html lang>` remain stable.
7. Treat Playwright strict-locator failures as possible timing, route-state, or
   accessibility-contract defects. Diagnose the rendered accessible tree;
   never weaken a check merely to bypass multiple matches.
8. After deployment, fetch the shell and relevant JavaScript/data/localization
   assets. Record exact commit, run, job, artifact, deployment, final URL,
   `ETag`, `Last-Modified`, `Cache-Control`, `Age`, and cache-status evidence.
   Repeat the request to demonstrate stable ETag and cache propagation.

## Environment secret audit overlay

When a repository uses managed databases, Auth.js/OIDC, CI deployment, or
external providers, add this audit before live verification:

1. Trace every environment variable from examples, workflows, build files,
   server code, browser code, Prisma configuration, provider adapters, tests,
   and deployment settings. Classify it as production runtime, CI/CD,
   migration-only, authentication, optional, or incorrectly required.
2. Separate public configuration, protected non-secret configuration,
   server-only runtime secrets, migration-only credentials, CI/CD credentials,
   and development-only secrets. Use distinct Development, Preview, and
   Production values; never reuse production credentials in lower
   environments.
3. Keep database URLs, authentication secrets, OIDC client secrets, AI keys,
   payment keys, webhook secrets, storage credentials, and development
   administrator keys out of source, examples, browser bundles, logs, workflow
   literal values, screenshots, and reports. Example files contain names only.
4. Remove variables that the architecture does not use. Do not require
   Supabase browser/Auth values when the repository only uses Prisma against
   Supabase PostgreSQL. Do not upload a privileged direct migration URL to the
   application runtime.
5. Scan both Git-tracked files and built public assets for credential patterns,
   retired fixed keys, weak defaults, and server-only variable names. Ensure
   the scanner does not flag its own test patterns or silently skip staged new
   files.
6. Validate required configuration by presence and non-disclosing structural
   checks only. Require remote TLS database URLs, approved HTTPS origins and
   issuer metadata, strong authentication secrets, and separate pooled/runtime
   and direct/migration endpoints where the provider requires them.
7. Keep the guarded workflow fail-closed. Missing values stop preflight before
   migrations or deployment. Record absent environment export, missing GitHub
   environment configuration, unavailable Docker/PostgreSQL, provider
   connection errors, and absent interactive OIDC identity as separate
   `BLOCKED` results.
8. Run live migration, seed, connectivity, repository contracts, OIDC
   sign-in/callback/session/RBAC/logout, and deployment checks only when the
   approved values are genuinely available. Never substitute localhost,
   placeholders, test issuers, or browser demos for live-provider evidence.
9. Report each check independently with date, environment, owner, result,
   evidence, blocking effect, and exact next action. A missing workflow run is
   `NOT RUN`, not `FAIL`; a workflow preflight rejection is `BLOCKED` or
   `FAIL` according to the observed conclusion.

## Content and publication review overlay

When a repository includes public legal, professional, or multilingual marketing content, add a pre-publication review before browser or production verification:

1. Inventory every homepage, About, services, library, CTA, credential, affiliation, jurisdiction, and outcome-oriented claim.
2. Classify each statement as source-supported, pending substantiation, jurisdiction-sensitive, or translation-sensitive. Never invent credentials, admissions, affiliations, rankings, case outcomes, prices, or authorizations.
3. Prefer lower-risk capability wording such as "legal researcher," "international law specialist," "dispute-resolution specialist," or "advisory support" unless regulated authorization is documented.
4. Require documentary evidence and publication permission for named institutions, scholarships, publications, conferences, and professional affiliations.
5. Keep legal service scope, eligible jurisdictions, exclusions, no-relationship wording, and outcome limitations explicit for each service.
6. Treat French, Simplified Chinese, and Traditional Chinese as separate review tracks. Preserve meaning-sensitive disclaimers and require qualified reviewer approval for terminology, script, target regions, and fallback behavior.
7. Reframe public-facing library content as "Legal Resources," "Publications," or "Research Library" unless the business model is approved to sell products. Keep resource listings, prices, licenses, and purchase controls gated.
8. Maintain machine-readable metadata such as `in_review`, `qualifiedReviewerApproved: false`, `scriptAndRegionsApproved: false`, and `targetRegionsApproved: false` until sign-off is recorded.
9. Produce a sign-off checklist naming the evidence, owner, reviewer, status, and blocking effect for identity, credentials, jurisdiction, claims, translations, and final publication.
10. If any blocking approval is absent, report `BLOCKED`; do not infer clearance from a browser demo, source document, or local gate change.



## Legal Library expansion and static-demo verification

When source documents add public Legal Library or About content, extend the content-review overlay with this repeatable sequence:

1. Extract the supplied DOCX or source brief locally and inventory every named resource, topic, jurisdiction reference, author/credential claim, language, and call to action. Do not infer missing resource contents, authorship, dates, or permissions.
2. Expand the library using resource-oriented labels such as `Legal Library`, `Legal Resources`, `Publications`, or `Research Library` unless an approved commercial model explicitly supports products. Preserve informational/research positioning.
3. Create one gated fixture record per approved topic or source-supported resource. Include English, French, Simplified Chinese, and Traditional Chinese metadata when those locale tracks exist. Keep `fixture: true`, unavailable purchase/readiness state, source/currency/licensing limitations, and explicit jurisdiction scope.
4. Add or preserve search, topic filters, language cues, resource-type labels, detail routes, and disabled purchase/download controls. Ensure a missing or unapproved locale falls back safely without presenting a translation as approved.
5. Run a fresh claim review for resource titles, summaries, ?international? or jurisdictional scope, current-law implications, authorship, institutional references, credentials, affiliations, outcomes, and About-page positioning. Mark each item as source-supported, pending substantiation, jurisdiction-sensitive, or translation-sensitive.
6. Update the approval checklist with evidence, owner, reviewer, status, and blocking effect for every resource, locale, license, citation, update date, and publication permission. Keep release status `BLOCKED` while any required sign-off is open.
7. Verify the running application route by route: home, services, library, guidance, About, and launch controls. On the library route, test the unfiltered resource count, topic search/filter behavior, resource detail navigation, disabled controls, and locale switching for French, Simplified Chinese, and Traditional Chinese.
8. Serve the static-demo bundle separately and repeat the library search/filter, About content, and locale-switch checks. Record whether the local bundle is verified and whether public CDN propagation was independently confirmed; do not treat a push or browser demo as production approval.
9. Report exact resource counts, filters exercised, locale headings, About sections observed, test results, static-demo commit, and remaining publication blockers. Never call a gated fixture library an approved publication or legal advice.

## Forward-test lessons and packaging limits

### Latest fixture and evidence lessons

1. Separate static implementation evidence from live infrastructure evidence.
   `prisma generate` and `prisma validate` may pass with a process-local
   connection string even when PostgreSQL is absent. Record migration, seed,
   and contract execution independently; a Prisma `P1001` or client
   initialization error is `BLOCKED/FAIL`, not a pass or an unspecified skip.
2. Never persist ad hoc database URLs or credentials in the repository. A
   temporary `DATABASE_URL` may be supplied only for the current process, and
   reports may identify the host/port and outcome without printing secrets.
3. Before a real Auth.js/OIDC attempt, check only that `AUTH_SECRET`,
   `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET` are present and
   have plausible lengths. Obtain them through the approved secret channel;
   never ask users to paste values into ordinary chat and never echo them in
   logs. Missing or incomplete values keep sign-in, callback, session, RBAC,
   and logout verification `BLOCKED`.
4. Treat a checked-in GitHub Pages workflow, a local static-demo pass, and a
   remote Pages deployment as separate evidence layers. A fixture without a
   dedicated remote repository and approved GitHub credentials cannot claim a
   deployed URL, workflow conclusion, artifact, or cache headers.
5. Keep translation approval fail-closed. Require named reviewers, the
   qualification basis, target regions, terminology decisions, and actual
   sign-off dates for each locale. Use `Not supplied`, `Not signed`, and
   `Open` when evidence is absent; never infer approval from fluent text,
   source documents, or browser rendering.
6. When a retry is blocked, append a dated evidence entry containing the exact
   commands attempted, environment mode, adapter selection, host/port (without
   secrets), error class, and next prerequisite. Preserve prior passing
   validation and browser evidence instead of overwriting it.

### Secure frontend-to-backend and provider-selection lessons

1. Treat a static frontend host such as GitHub Pages as browser-only. Route all
   database, authentication, authorization, payment, storage, and sensitive
   legal-data operations through an approved server or serverless API.
2. Never connect browser code directly to PostgreSQL and never expose
   `DATABASE_URL`, database usernames/passwords, Prisma credentials, private
   storage keys, provider tokens, or raw payment data in JavaScript, HTML,
   screenshots, logs, or API responses.
3. Prefer Supabase PostgreSQL for a managed development database when a genuine
   free tier and approved account are available; use Neon as the documented
   fallback. Verify PostgreSQL support, external reachability, TLS, Prisma
   compatibility, migration support, seed support, and current pricing/limits
   before selecting a provider. Do not call a provider "free" or "approved"
   without current evidence.
4. Use the provider's direct connection for migrations/administration and its
   pooler connection for serverless/application traffic when required. Keep
   separate development, staging, and production databases and credentials.
5. Select and document an approved backend target before deployment. A
   Render web service is a suitable default target for a Node/Prisma API when
   the project owner approves it; Vercel serverless functions are an alternative
   when the runtime and connection-pooling model are explicitly approved.
   Never claim frontend-to-backend verification until the API is deployed,
   health-checked, authenticated, and observed using the same safe database
   boundary.
6. If no approved backend target or provider-issued `DATABASE_URL` exists,
   preserve the frontend, document the target and environment variables, and
   mark backend deployment, database migration, seed, `SELECT 1`, live
   contracts, and frontend-to-backend checks `BLOCKED`.
7. Make Prisma validation fail closed when `DATABASE_URL` is absent. Do not
   supply a localhost, SQLite, fake, or placeholder URL merely to make a
   command pass. Distinguish schema/configuration validation from connectivity
   and migration evidence.

## Multilingual evidence and static deployment overlay

When public legal content includes credentials, publications, conferences, ICC recognition, Bar status, or multilingual review:

1. Require authenticated or authoritative records before changing identity-match or publication-permission fields; name similarity and secondary directories remain leads only.
2. Expose source title, source type, identity-match status, and publication-permission status for every item in every supported locale.
3. Localize admin evidence filters and status values for English, French, Simplified Chinese, and Traditional Chinese, and add dedicated Playwright assertions for each locale.
4. Add a checked-in GitHub Pages workflow when static deployment is used. Verify the deployed commit, workflow/build status where available, HTTP status, `ETag`, `Last-Modified`, `Cache-Control`, `Age`, and cache-hit/miss headers after propagation.
5. Keep publication gates closed when evidence, translation approval, jurisdiction review, or permission to link/reproduce remains unresolved.

## GitHub Pages and Preliminary Legal Assessment overlay

When a repository deploys a browser-only or static demo to GitHub Pages and
implements a Preliminary Legal Assessment workflow:

1. Identify the exact commit under review and query the repository's Pages
   workflow run. Record workflow name, run URL, status, conclusion, deploy job
   conclusion, and Pages artifact name, ID, URL, and digest when available.
2. Verify the deployed URL independently after propagation. Record HTTP status,
   `ETag`, `Last-Modified`, `Cache-Control`, `Age`, and cache-hit/miss headers.
   Treat a successful git push without a successful Pages run or fresh response
   as incomplete deployment evidence.
3. Confirm the assessment route captures language, jurisdiction, legal issue,
   urgency, and attorney-review state. Require explicit states for missing
   information, unsupported jurisdiction, escalation, attorney review, and
   attorney-approved response.
4. Persist assessment submissions server-side when Prisma is enabled. Require
   authenticated RBAC for queue listing and review mutations; public submission
   may create only a constrained intake record and may not self-approve.
5. Verify review transitions and audit behavior: creation records the initial
   status, reviewer actions record actor and prior/next status, attorney
   approval requires an authenticated reviewer, and rejected or unsupported
   submissions cannot be presented as approved legal advice.
6. Add contract and Playwright coverage for missing-information,
   unsupported-jurisdiction, urgent escalation, default attorney-review,
   authenticated queue access, unauthorized queue denial, and
   attorney-approved status gating. Keep live database checks explicitly
   `PASS`, `FAIL`, `SKIP`, or `BLOCKED`; never infer persistence from a
   browser-only fallback.

## Language-first legal intake and Home messaging overlay

When the supplied product brief requires multilingual legal intake or a
multilingual law-firm Home experience:

1. Make language selection the first explicit intake field, before
   jurisdiction, topic, or narrative facts. Preserve the selected locale when
   rendering results and when creating an assessment or guidance submission.
2. Keep Home messaging aligned with the controlled workflow: explain that the
   system can organize facts, identify jurisdiction and urgency, and prepare a
   review brief; do not describe it as an autonomous lawyer, instant legal
   advice, or a substitute for counsel.
3. Preserve controlled guidance safeguards: require jurisdiction and topic,
   refuse unsupported scope, escalate urgent or deadline-sensitive matters,
   identify missing information, and show the non-relationship disclaimer.
4. Maintain equivalent meaning across English, French, Simplified Chinese, and
   Traditional Chinese. Treat legal terminology and disclaimers as separate
   review tracks; do not assume fluent translation is qualified approval.
5. Add focused browser assertions for language-first field order, locale
   switching, Home assessment messaging, missing-information behavior,
   unsupported-jurisdiction refusal, urgency escalation, and attorney-review
   status. Run these tests alongside the broader route suite.

## Repository-fit and translation-gate audit

1. Before forward-testing, inventory whether the target has a multilingual
   Home, language-first guidance, Preliminary Legal Assessment persistence,
   authenticated review queue, Prisma migration, Auth.js/RBAC, and a deployable
   static surface. Mark each missing surface `BLOCKED - repository mismatch`.
2. Test language persistence independently from interface locale: select a
   non-default intake language, submit a supported route, and assert that the
   evaluator result and persisted record retain the selected language.
3. Run controlled-guidance tests in isolated browser contexts with language,
   jurisdiction, and topic set explicitly. Do not let shared storage or implicit
   defaults turn missing-scope behavior into refusal/escalation evidence.
4. Require a translation checklist with target regions, terminology decisions,
   reviewer identity, qualification basis, sign-off date, and approval status.
   Never invent reviewer names or dates; absent evidence remains `Open` and
   blocks qualified-translation approval.

## Website-wide consistency audit overlay

When a repository includes multiple public legal, AI, publication, commerce,
and administrative surfaces, run a cross-page consistency pass before release:

1. Inventory Home, Services, Legal Library, publication/compendium detail,
   guidance, Preliminary Legal Assessment, About, Contact, booking, client
   portal, admin, navigation, forms, APIs, and static-demo routes.
2. Compare terminology, claims, jurisdictions, languages, prices, editions,
   dates, availability, CTAs, disclaimers, AI capabilities, and workflow
   descriptions against a single authoritative source where possible.
3. Check that legal information, preliminary assessment, AI-assisted drafting,
   attorney review, and individualized legal advice remain distinct on every
   route. Ensure public publications never imply legal representation.
4. Verify technical consistency: routes and links, form validation, loading and
   error states, authentication and RBAC boundaries, database assumptions,
   provider adapters, API behavior, responsive layout, accessibility, and
   exposed-secret controls.
5. Compare English, French, Simplified Chinese, and Traditional Chinese
   independently. Check meaning, legal terminology, CTA behavior, fallback
   behavior, script/region review, and text-fit issues. Do not treat machine
   translation or browser rendering as qualified approval.
6. Fix only unambiguous, source-supported defects directly. Do not resolve a
   contradiction by inventing credentials, authorities, prices, services,
   jurisdictions, publication facts, testimonials, or integrations.
7. Classify findings as `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`. Record each
   finding with owner, evidence, correction status, and blocking effect.
8. Keep a final audit report with separate sections for critical issues,
   high-priority issues, medium/low issues, corrections made, human-review
   items, verification results, and overall assessment.
9. Keep launch and publication gates closed when any identity, jurisdiction,
   privacy, security, AI, commerce, provider, content, licensing, translation,
   or publication-permission decision is unresolved.
10. Add focused browser assertions for cross-page CTA consistency, localized
    labels, compendium gating, AI attorney-review boundaries, route integrity,
    and launch-control behavior. Report live database/provider checks
    separately from static/unit/browser evidence.

Apply these controls when forward-testing the workflow on another repository or temporary fixture:

1. Verify repository fit before claiming generalization. Confirm the candidate actually contains Prisma, Auth.js/OIDC, the target Legal Library/content surface, and a runnable browser or static-demo route. If a repository is a commerce adapter or otherwise lacks those components, report `BLOCKED - repository mismatch`; do not convert unrelated unit-test passes into a full forward-test pass.
2. Create a minimal isolated fixture only when a suitable second repository is unavailable. Include a Prisma schema and checked-in migration, Auth.js-compatible configuration, fail-closed OIDC checks, gated multilingual resources, approval metadata, an API/static demo, and focused unit/Playwright tests.
3. Separate implementation evidence from infrastructure evidence. `DATABASE_URL` missing, Docker unavailable, PostgreSQL unreachable, Prisma `P1001`, or absent approved OIDC variables are explicit `BLOCKED` results, not passes and not generic "not run" labels.
4. Before real-provider testing, check only presence and lengths of `AUTH_SECRET`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`; never print their values. Without approved values, retain only local fail-closed or test-issuer evidence.
5. Record fixture packaging separately from workflow validation. A workspace approval rejection, archive-creation failure, or inability to publish a remote repository does not invalidate the fixture checks, but do not claim an archive, commit, or remote URL that was not actually created.
6. If archive creation is rejected or unavailable, preserve the fixture directory and write a registered evidence report naming the exact path, checks run, blocked checks, and packaging limitation. Retry packaging only after the workspace approval layer permits it.
7. For a successful fixture run, report exact resource count, locale set, gate metadata, Prisma commands, migration/seed/live-contract results, Auth.js sign-in/callback/session/RBAC/logout results, Playwright results, package hash, and remaining blockers.

### Latest Pages, encoding, session, booking, and admin regression checks

Apply these checks after a Pages deployment or any authentication/booking repository change:

1. Query the exact Pages workflow for the reviewed commit and record run, deploy-job conclusion, artifact ID, formal `sha256:` digest, deployment URL, HTTP status, `ETag`, `Last-Modified`, `Cache-Control`, `Age`, and cache-hit headers. Keep artifact and CDN evidence separate.
2. Decode every localized source and Playwright file as strict UTF-8 and scan code points for replacement characters and common mojibake markers. Confirm suspicious terminal rendering with source bytes and rendered browser text before editing.
3. Verify development sessions expire server-side, encoded cookie values parse losslessly, logout deletes the backing session, and post-logout protected requests are denied. Keep development login unavailable outside development.
4. Review every admin route for an awaited server-side RBAC check, including session-status endpoints and payment/status mutations. An authenticated non-admin must not receive an admin authorization result.
5. Require booking creation, payment reconciliation, and administrative status changes to lock the booking and slot rows, use serializable transactions, enforce an explicit state machine, and reject late payment or terminal-state revival. Attribute administrative payment and status audit events to the authenticated actor.
6. Keep questionnaire, assessment, versioning, booking, payment, availability, and audit writes in one transaction where the state change and audit record must commit together. Add a regression test for each discovered boundary defect.
7. Run the complete unit and Playwright suites after localization or admin changes. Report live Prisma contracts independently as `PASS`, `FAIL`, `SKIP`, or `BLOCKED`; a missing reachable database is never a pass.
8. Use Vercel serverless as the approved backend target when selected. Keep pooled/runtime and direct/migration PostgreSQL URLs separate, server-only, TLS-protected, and supplied only through the approved secret channel. Never place database values in Pages assets, browser code, reports, logs, workflow literals, or ordinary chat.

### Assessment browser-state and final-suite evidence

1. Treat multi-state browser tests as stateful workflows. After asserting an
   intentional `MISSING_INFORMATION` result, fill every other required intake
   field before asserting `UNSUPPORTED_JURISDICTION`, escalation, or approval.
   A failing expectation caused by an omitted required field is a test-state
   defect, not evidence that the application state machine is wrong.
2. When repairing a test-state defect, preserve the product validation order,
   add the smallest deterministic setup change, rerun the complete browser
   suite, and record the corrected test commit separately from unrelated
   implementation changes.
3. Final browser evidence must report the exact test count, passed count,
   failed count, worker/concurrency mode when relevant, and the final commit
   containing any regression fix. Do not report an earlier partial or failed
   run as the final suite result.
4. Keep application defects and test-fixture defects distinct in the evidence
   report. Include the failing assertion, root cause, correction, rerun result,
   and whether production behavior changed.

### Static-demo visual, accessibility, and CDN verification

After changing a browser-only public mirror, run a focused visual and
accessibility review at both desktop and mobile viewport sizes. Walk Home,
About, Services, Legal Library, and Guidance in `en`, `fr`, `zh`, and
`zh-Hant`; confirm locale switching, text fit, route stability, landmarks,
heading structure, focus visibility, skip-link behavior, keyboard navigation,
mobile-menu state, accessible names, and absence of horizontal overflow.

Add or update browser-only content only within the curated static boundary.
Keep the demo disclosure factual and localized, preserve `noindex` and all
publication/provider/legal gates, and do not expose authentication, database,
booking, payment, or confidential-submission capabilities in the mirror.

Republish the dedicated Pages repository separately from the private backend.
Record the exact source commit, workflow run and deploy-job conclusions,
artifact ID and formal digest, deployment URL, and the public asset response.
Perform at least two CDN requests and compare status, final URL, `ETag`,
`Last-Modified`, `Cache-Control`, `Age`, and cache-hit/miss headers. Distinguish
successful source publication from a completed Pages deployment and from
post-deploy cache propagation. A missing workflow, unexpected asset, failed
accessibility check, or stale response remains `BLOCKED` or `FAIL` rather than
being inferred as success.

### Narrative-first multilingual About-page workflow

Apply these checks when rewriting a professional About page from source
documents or an existing credential-heavy profile:

1. Lead with professional identity, current focus, experience, and value.
   Synthesize qualifications, research, memberships, publications, and selected
   experience into short narrative paragraphs; keep detailed education and
   chronology in optional disclosures rather than presenting a condensed CV.
2. Preserve the exact approved full name `Tezzeta N’gungwa Mbuya` in identity
   fields and headings. Apply
   the documented surname or short-name rule consistently in prose. Scan every
   locale for prohibited former-name variants and CV/resume source wording.
3. Do not invent or upgrade credentials, admissions, clients, matters,
   employers, awards, memberships, languages, outcomes, or years of experience.
   Keep regulated-title, identity, image-rights, publication-permission, and
   translation approvals fail closed unless authenticated evidence resolves
   them.
4. Preserve resolved credential decisions without reintroducing obsolete
   verification requests. Keep unrelated publication and evidence metadata,
   `noindex`, legal disclaimers, and launch gates intact.
5. Maintain independent English, French, Simplified Chinese, and Traditional
   Chinese copy. Require equivalent facts, five-part narrative structure when
   used, localized disclosure labels and CTAs, correct script, and exact
   identity headings. Browser rendering is not qualified translation approval.
6. Mirror the approved content and presentation changes into the dedicated
   static-demo repository without copying backend, authentication, database,
   provider, payment, or confidential-submission functionality.
7. Add focused Playwright checks for the four professional titles, narrative
   paragraph count, identity heading, education and experience disclosures,
   publication-control disclosure, resolved credential state, contact and
   consultation CTAs, `noindex`, locale switching, and mobile overflow.
8. Run syntax, unit, main Playwright, and named static-demo regression suites.
   Report live Prisma contracts separately when infrastructure is absent.
9. Capture fresh desktop and mobile screenshots for all four locales after the
   final code state. Inspect text wrapping, disclosure fit, timeline rhythm,
   portrait rendering, CTA stacking, encoding, horizontal overflow, evidence
   metadata retention, and gate visibility.
10. Commit the main and static-demo repositories separately. Review each staged
    diff, exclude unrelated dirty files and nested-repository entries, record
    both commit SHAs, and do not claim deployment unless a later Pages workflow
    and public-asset check prove it.

### Claim integrity, qualified review, and dual-repository evidence

Apply these checks whenever a multilingual professional profile is reviewed,
rewritten, mirrored, or prepared for reviewer sign-off:

1. Assign every express or implied claim a stable ID. Reconcile the category
   totals against the item count before delivery; a summary that does not add
   up to the detailed claim set is a failed integrity check.
2. Maintain a reviewer-ready claim-evidence matrix containing the exact claim,
   risk class, proposed lower-risk wording, evidence required, evidence owner,
   reviewer role or authenticated name, evidence location, identity-match
   status, publication-permission status, due date, decision, sign-off date,
   expiry or revalidation date, blocking effect, and notes. Use `Not supplied`
   rather than inventing people, dates, evidence, or permission.
3. Apply lower-risk wording consistently across English, French, Simplified
   Chinese, and Traditional Chinese. Remove unsupported quantified experience,
   client-category, current-affiliation, regulated-specialist, universal
   authorization, endorsement, and outcome implications without adding a new
   factual claim.
4. Preserve resolved credentials, stable evidence metadata, publication
   controls, jurisdiction and engagement limitations, `noindex`, and other
   fail-closed gates. Lower-risk wording does not constitute production
   clearance.
5. Decode every edited locale source, test, matrix, and sign-off document as
   strict UTF-8. Scan for U+FFFD and common mojibake sequences, then verify
   representative accented French, Simplified Chinese, and Traditional Chinese
   terms by exact code point or source string. Treat terminal-font or console
   decoding artifacts separately from corrupt source bytes.
6. Require a separate qualified-review record for each locale. Capture the
   reviewer name, qualification or authority basis, target region, terminology
   decisions, reviewed version or commit, decision, review date, sign-off date,
   and conditions. Browser rendering, machine translation, fluent reading, or
   synchronized source is not qualified approval.
7. Keep the main repository and browser-only mirror as distinct publication
   tracks. Record the local commit, configured remote, push result, directly
   queried remote branch SHA, Pages workflow/run, artifact digest, deployment
   URL, and CDN headers independently. Never stage the nested mirror in the
   parent repository or describe a successful push as a verified deployment.
8. Run focused claim assertions and complete browser regressions after the
   final runtime override layer is updated in both repositories. Confirm exact
   identity handling, locale-specific lower-risk titles, claim-count integrity,
   retained evidence disclosures, closed publication gates, correct
   `<html lang>`, and no horizontal overflow.

### DOCX-driven multilingual service mapping

Apply these checks when a supplied DOCX requests additions or changes to a
professional legal-services catalog:

1. Extract the DOCX locally and map each requested category to the existing
   service taxonomy, routes, filters, detail metadata, booking controls, and
   publication model before editing. Preserve compatible existing categories;
   document intentional overlaps such as a cross-cutting International Law
   grouping.
2. Reconcile the requested category count and names against the implemented
   catalog. Do not silently merge, omit, or append categories without recording
   the architecture decision.
3. Add English, French, Simplified Chinese, and Traditional Chinese as separate
   records with equivalent title, summary, audience, included scope, and
   exclusions. Localize filter and card labels; never expose internal slugs.
4. Treat every new legal-service claim as unapproved unless authenticated
   evidence establishes the service model, responsible provider, current
   authorization, jurisdictions, qualifications, conflicts process,
   engagement terms, and permitted public wording.
5. Keep new records `fixture: true`, evidence pending, booking disabled, and
   production publication blocked. A card, route, translation, or passing test
   is not evidence that the service is offered or authorized.
6. Apply service-specific gates for representation, expert-witness work,
   consultancy, environmental law, and ESG. Do not imply representation,
   appointment, admissibility, certification, regulatory approval, compliance
   assurance, local-law authority, deadline protection, or outcomes.
7. Mirror only the reviewed browser content into the dedicated static-demo
   repository. Do not add authentication, database, booking, payment,
   providers, or confidential-submission capability to the mirror.
8. Add focused browser assertions for all category labels in all four locales,
   filtering, cards, detail routes, fixture badges, evidence state, exclusions,
   cross-cutting subject wording, and disabled booking. Run syntax, strict
   UTF-8/mojibake, unit, main Playwright, and named static-demo suites.
9. Commit the main and static-demo repositories separately after inspecting the
   staged diff. Exclude unrelated hunks, dirty reports, generated artifacts,
   secrets, and the nested static-demo entry from the parent commit. Report
   qualified legal and translation approvals independently from test results.

### Approval records and single-path Pages verification

Apply these checks when approval evidence and a GitHub Pages deployment are
updated together:

1. Commit approval records and reusable skill source by exact path only.
   Inspect the cached file list and patch, exclude packaged skills and unrelated
   application/report changes, and use a focused message describing the
   approval and verification controls.
2. Never replace a missing approver, authority basis, decision, or sign-off date
   from a placeholder request. Retain `Name not supplied`, `Not signed`, and a
   blocking decision until authenticated reviewer details are actually
   provided.
3. Query the Pages workflow by the exact source commit. Record workflow and job
   conclusions, artifact name, ID, size, expiry, authenticated download URL, and
   the API-provided formal `sha256:` digest.
4. Fetch the deployed URL at least twice. Record status, final URL, `ETag`,
   `Last-Modified`, `Cache-Control`, `Age`, cache status, and cache-hit count.
   Confirm a stable validator and increasing age or a documented revalidation;
   do not infer propagation from a single response.
5. Detect duplicate Pages paths by comparing repository Pages `build_type`,
   checked-in workflows, and all runs for the exact commit. Treat simultaneous
   legacy branch publishing and Actions deployment as a configuration defect,
   even when both runs succeed.
6. Select one authoritative path. Prefer the checked-in Actions workflow when
   explicit artifact, digest, job, and deployment evidence is required. Change
   repository settings through an authenticated API without exposing tokens,
   dispatch a fresh run, and verify that no new legacy deployment run appears
   for the verification commit.
7. Report source push, workflow execution, artifact integrity, deployment
   status, public content, and CDN propagation as separate evidence layers.

### Deterministic packaging and dependency monitoring

Apply these controls when publishing a reusable verification skill or tracking
an upstream deployment dependency:

1. Validate the skill directory before packaging. Confirm the source matches
   the intended commit or reviewed diff and that no generated package, secret,
   report, cache, or unrelated workspace file is inside the skill directory.
2. Package the unchanged source twice and compare SHA-256 hashes and byte sizes.
   Treat differing outputs as a deterministic-packaging failure; investigate
   timestamps, file ordering, metadata, or unintended inputs before publishing.
3. Register only the final validated package. Record source commit, file count,
   byte size, SHA-256, validation result, and whether the installed files match
   the packaged source.
4. Populate approval records only from actual authenticated reviewer data.
   Require one record per service with reviewer name, authority or qualification
   basis, decision, actual sign-off date, and reproducible evidence location.
   Bracketed templates, role labels, proposed owners, or future intentions are
   not approval evidence.
5. Preserve `Name not supplied`, `BLOCKED - NOT APPROVED`, and `Not signed`
   whenever any mandatory approval field is missing or cannot be authenticated.
6. For unresolved upstream dependencies, create a read-only scheduled monitor
   with a defined cadence, time zone, official issue or pull-request references,
   release/tag checks, and immutable-SHA verification. Do not grant repository
   write access merely to monitor status.
7. A monitor may recommend an update only when an official fixed release exists.
   It must not edit repositories, suppress warnings, or adopt an unmerged pull
   request, branch head, or unreleased commit automatically.
8. Record automation name, ID, status, cadence, time zone, next scheduled run,
   checked sources, no-change behavior, and the human action required after a
   fixed release is detected.

### Evidence-first service detail rendering

Apply these checks when a DOCX requires an evidence map for each service
detail route:

1. Inventory every individual service record before editing. Reconcile the
   record count against the filter taxonomy and document any cross-cutting
   category such as International Law.
2. Map each record as `Service Category -> Legal/Academic Concept -> Source(s)
   -> Supported Principle -> Application`. A source must support the specific
   proposition being shown, not merely the general topic.
3. Store source title, issuing body, date or `n.d.`, APA 7 citation text, and a
   stable HTTPS URL as structured metadata. Render references accessibly on the
   detail route with safe external-link attributes.
4. Render a localized evidence-status notice and jurisdiction-specific caveat
   for every locale. Keep source-supported legal concepts separate from proof
   of provider qualification, authorization, service availability, or outcomes.
5. Differentiate `audience`, `included`, and `excluded` text for every record.
   Address representation, filing, negotiation, litigation, deadlines,
   procedural rights, expert appointment/admissibility, permits,
   certification, regulatory approval, investment advice, and outcome limits
   where relevant to the category.
6. Keep newly revised records fail closed: `fixture: true`,
   `evidenceStatus: "pending"`, booking disabled unless an existing explicit
   development fixture requires otherwise, and production publication blocked.
7. Mirror the evidence module, detail rendering, locale labels, and browser
   assertions into the dedicated static-demo repository without importing from
   the parent repository or exposing backend capabilities.
8. Run a route matrix for all records in `en`, `fr`, `zh`, and `zh-Hant`.
   Verify heading, three scope blocks, evidence status, at least one reference,
   localized jurisdiction caveat, `<html lang>`, disabled controls, and no
   horizontal overflow.
9. Register the evidence review document separately from code commits. Report
   source verification, legal review, jurisdiction review, and translation
   review as independent gates; passing tests do not clear any of them.

### DRC legal-library, Bar evidence, and deployed route verification

1. Extract each supplied DRC-law DOCX locally and map every proposed law,
   regulation, bylaw, OHADA instrument, REC instrument, bilateral investment
   treaty, and regional economic agreement to a stable category and source
   record. Preserve corrections and uncertainty as review notes.
2. Prefer official gazettes, treaty depositaries, intergovernmental
   organizations, and authenticated professional directories. Record source
   title, issuing body, instrument type, URL, edition/effective date or
   `pending`, currency status, and publication permission separately.
3. Keep resources fail closed until the exact text, amendments, jurisdiction,
   license, qualified legal review, and all four translations are approved.
   Mark them as fixtures, disable purchase/download controls, and never infer
   that an indexed source is current or complete.
4. Treat a Bar directory entry as evidence for only the fields displayed by
   that directory. Record name order, status label, registration/order number,
   Bar, retrieval date, identity-match decision, and publication permission
   independently. Do not infer wider authorization, experience, or service
   availability.
5. Present selected experience as concise standalone matter statements when
   the approved design omits dates and separate titles. Do not render synthetic
   dates, `Date not stated`, role labels, or organization labels. Retain
   evidence-pending metadata, avoid named-client or outcome claims, and explain
   DRC operational relevance without turning an entry into legal advice or a
   current service offer.
6. Verify every service detail route in `en`, `fr`, `zh`, and `zh-Hant`. For a
   14-service catalog, require 56 independent route-locale checks covering
   heading, evidence status, references, jurisdiction caveat, locale, booking
   gate, and public asset availability.
7. After Pages publication, bind evidence to the exact commit and record the
   workflow/run, deploy job, artifact ID, formal digest, deployment URL,
   required-asset hash, and two-request CDN headers. A successful run with a
   missing curated asset remains a failed public-content verification.
8. Append corrected deployment evidence to the cleanup decision log without
   rewriting historical blocked attempts. Record preserved, ignored, reverted,
   deleted, tracked, and locally retained items, plus the final repository and
   remote SHAs.

### Official-source mapping and multilingual Legal Library gates

Apply these checks when a DOCX or public-site request adds DRC laws,
regulations, bylaws, OHADA instruments, African Union or REC instruments,
bilateral investment treaties, or regional economic agreements:

1. Create one evidence record per instrument. Store the exact title, law or
   treaty number, issuing body, instrument type, official or authenticated
   source URL, publication issue, adoption date, publication date, effective
   date, language, jurisdiction, and retrieval date.
2. Separate **source identity** from **legal currency**. A source page may
   identify an instrument without proving that it is consolidated, in force,
   unamended, or complete. Require a currentness decision, amendment list,
   repeal or replacement check, and an effective-date decision.
3. Prefer official gazettes, treaty depositaries, OHADA and African Union
   institutional pages, and authenticated professional or government
   repositories. Treat discovery indexes such as UNCTAD treaty collections as
   finding aids, not as proof of DRC ratification, entry into force,
   termination, reservations, or completeness.
4. Record republication permission as a separate field from source access.
   A publicly viewable PDF or webpage does not automatically authorize
   copying, OCR, translation, sale, or republication. Capture the licence,
   terms, written permission, or an explicit `permission not established`
   decision.
5. Do not infer an exact law number, effective date, amendment, membership,
   ratification, or treaty status from a DOCX summary, search snippet, index,
   or secondary citation. Use `pending` and stop publication when the primary
   record cannot be authenticated.
6. Keep resources fail closed until source identity, currentness, effective
   date, jurisdiction, permission, legal review, and four-locale translation
   review are complete. Mark them as fixtures and disable purchase, download,
   and text-reproduction controls.
7. Walk through every Legal Library category and at least one detail route in
   `en`, `fr`, `zh`, and `zh-Hant`. Verify localized category labels, source
   metadata, currentness notice, permission notice, jurisdiction caveat,
   `<html lang>`, disabled controls, and no horizontal overflow.
8. Test the category matrix independently. A passing English route does not
   clear French, Simplified Chinese, or Traditional Chinese. Record each
   locale-category result and retain screenshots or trace references where
   visual review is required.
9. Keep legal-source, amendment/currentness, rights, legal-review, and
   translation-review decisions separate in the evidence report. Browser
   rendering, automated tests, and a public URL are implementation evidence,
   not qualified legal approval.
10. When any required field is missing, report the exact owner action:
    obtain the official gazette or treaty record, verify the amendment and
    effective-date history, confirm republication rights, or obtain named
    qualified review. Do not replace the missing field with a likely date,
    generic source label, or inferred permission.

### Four-locale About visual review and append-only deployment evidence

When a deployed static demo contains the About page and Selected Experience:

1. Bind the review to the exact static-demo commit and Pages run. Record the
   workflow and deploy-job conclusions, artifact ID, byte size, formal
   `sha256:` digest, deployment URL, and required public asset hashes.
2. Capture desktop and mobile screenshots for `en`, `fr`, `zh`, and
   `zh-Hant`. Expand the Selected Experience disclosure before capture so
   standalone statements, evidence badges, and jurisdictional relevance notes
   are actually reviewed.
3. For every locale and viewport, verify the display identity, statement
   count, absence of date/title/organization subfields when the approved
   presentation is statement-only, heading hierarchy, portrait visibility,
   CTA wrapping, text containment, and horizontal-overflow status.
4. Summarize visual findings by locale and viewport. Distinguish verified
   defects from optional content-density refinements, especially for long
   translated mobile pages. Do not shorten or hide evidence metadata to make
   a page appear shorter.
5. Fetch the deployed root shell and at least one required JavaScript asset
   twice. Record HTTP status, content type, `ETag`, `Last-Modified`,
   `Cache-Control`, `Age`, cache-status headers, and hit counts. Require a
   stable validator plus a documented `MISS` to `HIT` transition or explain
   any revalidation behavior.
6. Append the new deployment and visual-review checkpoint to the cleanup log.
   Preserve all historical preserved, ignored, reverted, deleted, tracked,
   blocked, and locally retained sections byte-for-byte; never rewrite prior
   evidence to reflect a later implementation.
7. Keep screenshots and traces outside source control unless explicitly
   requested. Register the final cleanup log as the user-facing artifact.
   If the log is committed, stage only that path and verify the exact remote
   branch SHA after pushing.
8. Treat browser rendering, screenshot review, and CDN propagation as
   implementation evidence only. Keep legal-claim, identity, credential,
   jurisdiction, image-rights, qualified-translation, source-currentness,
   and publication-authorization gates separate and fail closed.

### Multilingual About identity, claims gating, and browser regression

Apply these checks when an About-page request changes the displayed identity,
removes legacy source-language references, or adds biography, academic,
experience, founding, or investor-advisory claims:

1. Preserve the approved full display identity exactly as supplied in headings,
   metadata, portrait alt text, and identity fields. In prose, use the
   approved short form only; do not leave legacy full-name sentence subjects,
   alternate name orderings, or source-document labels in rendered copy.
2. Inspect all final locale override layers in the main and mirrored
   static-demo repositories. Update `en`, `fr`, `zh`, and `zh-Hant` together,
   and verify runtime objects rather than relying on console rendering of
   UTF-8 source files.
3. Treat each new factual statement as an independent evidence-gated claim.
   At minimum isolate firm founding year, current doctoral-candidate status,
   research subject and framing, quantified experience duration and
   jurisdictions, advice to government entities/local communities/businesses,
   contractual/advisory/contentious experience, and investor-structuring
   support for DRC-related risks.
4. Keep experience jurisdictions distinct from current authorization to
   practise. Keep client-category statements distinct from current clients,
   endorsements, outcomes, or guarantees. Preserve conflict, scope,
   jurisdiction, acceptance, evidence, publication, and `noindex` controls.
5. Remove legacy references such as CV wording from public prose unless the
   source reference is intentionally retained as non-public evidence metadata.
   Do not rewrite historical review records solely to make their old state
   match the current public copy.
6. Extend the claim-evidence matrix with one row per new claim. Require an
   owner, evidence location, identity match, permission status, due date,
   qualified reviewer, decision, and sign-off date. Missing or unauthenticated
   fields remain `Pending`, `Not supplied`, or `Not approved`.
7. Add browser assertions for full-name identity fields, short-form prose,
   absence of legacy name/CV strings in rendered About content, all four
   locales, preserved publication controls, and preserved noindex behavior.
8. Capture desktop and mobile About screenshots for each locale after the
   change. Record viewport, route, locale, screenshot path, and any
   overflow, heading, CTA, portrait, density, or translation issue. Screenshots
   support implementation review only and do not clear legal or translation
   gates.
9. Stage only the reviewed About source, matrix/review documents, tests, and
   skill source in focused commits. Keep `.tmp-static-review`, test output,
   DOCX files, packages, and unrelated reports out of source control. Mirror
   the runtime and tests into the dedicated static-demo repository without
   staging that repository inside the parent repository.
10. Run syntax checks, unit tests, the main Playwright suite, and the
    static-demo Playwright suite. Report live database skips separately from
    ordinary failures and stop publication if identity parity, locale parity,
    noindex, evidence controls, or browser assertions fail.

### Dense mobile service details and mirrored responsive evidence

When long legal-service pages need mobile density refinements:

1. Identify the affected service IDs and capture a baseline in `en`, `fr`,
   `zh`, and `zh-Hant` at desktop and mobile sizes. Record route, heading,
   page height, clipping, scroll behavior, evidence count, and gate state.
2. Scope layout changes to the affected routes. Provide a localized section
   index, sticky below the actual mobile header, compact scope spacing and
   separators, an accessible return control, and a reference count in the
   existing native evidence disclosure. Do not shrink reading text to absorb
   translation expansion.
   Before changing selectors, inspect the complete CSS cascade at the target
   viewport. Check later desktop rules, media-query order, grid/flex
   declarations, min/max widths, box sizing, and inherited positioning so a
   desktop declaration cannot silently override the mobile override. Add a
   browser assertion for the effective computed layout (for example, one
   mobile grid column and equal content/action widths) rather than relying on
   source-order inspection alone.
3. Preserve all service copy, source metadata, citations, DRC relevance,
   limitations, pending evidence notices outside the disclosure, disabled
   transactions, gate explanations, `noindex`, and publication controls.
   Test keyboard focus and reduced-motion behavior for return controls.
4. Mirror only the browser-side changes into the independent static-demo
   repository. Assert the affected routes in each locale for localized
   labels, five section targets, sticky mobile offset, reference counts,
   focus return, visible gate text, disabled actions, and zero horizontal
   overflow. Keep desktop navigation in normal flow. Assert mobile/desktop
   parity for the rendered heading hierarchy, detail-column widths, action
   panel width, and viewport overflow after all CSS rules have resolved.
5. Capture a named 2-route x 4-locale x 2-viewport screenshot matrix and
   inspect desktop and mobile separately. Append dated findings, page-height
   measurements, screenshot paths, test totals, and outstanding refinements
   to the responsive audit without overwriting historical evidence.
6. Run syntax, unit, main Playwright, and static-demo Playwright suites. Stage
   exact implementation and test paths in a main commit; stage browser-only
   mirror paths in a separate static-demo commit; stage the responsive audit
   alone in a focused documentation commit. Verify cached file lists and
   leave unrelated modifications and generated images out of commits. Treat a
   failed computed-style parity assertion as a layout defect even when the
   page is technically usable; fix the cascade and rerun the focused test
   before the complete suites.
7. If publication is approved, push each branch and check exact remote SHAs.
   Tie Pages workflow conclusion, deploy job, artifact ID and formal digest,
   deployment URL, deployed asset hashes, and repeat CDN headers to the
   exact static-demo commit. Public deployment evidence does not resolve
   legal, jurisdictional, rights, accessibility, qualified-translation, or
   production-publication approvals.

### Curated Pages validation and guarded source switching

When a repository still publishes GitHub Pages from a legacy branch or
directory, add a validation-first workflow before changing the active source:

1. Create a curated publish directory from an explicit browser-asset allowlist.
   Exclude server code, Prisma files, secrets, prompts, reports, test output,
   temporary evidence, and unrelated repository files. Include a generated
   checksum manifest and reject symlinks or unexpected files.
2. Pin `actions/checkout`, `actions/configure-pages`,
   `actions/upload-pages-artifact`, and `actions/deploy-pages` to immutable
   commit SHAs. Prefer current official actions whose runtime is compatible
   with the supported Node.js version; record the release tag beside each SHA.
3. Give the build job only `contents: read`. Scope `pages: write` and
   `id-token: write` to the deployment job and protect the job with both an
   explicit manual deploy input and a separately configured repository or
   environment approval variable.
4. Run the build with deployment disabled first. Verify JavaScript syntax,
   artifact file boundaries, SHA-256 manifest recomputation, browser suites,
   locale behavior, `noindex`, evidence metadata, disabled controls, and
   publication gates. Record the workflow run, build job, skipped deploy job,
   artifact ID, byte size, and API-provided `sha256:` digest.
5. Confirm GitHub Pages still reports the legacy source and public URL after
   validation. Do not describe an uploaded artifact as deployed. Keep the
   legacy source unchanged until an authenticated owner approves the switch.
6. Before cutover, obtain explicit approval for repository/public URL,
   allowlist, security permissions, source change, change window, operator,
   reviewer, and rollback authority. Keep legal, identity, source-currentness,
   republication-permission, accessibility, qualified-translation, and
   production-publication decisions separate.
7. At cutover, enable the deployment gate, dispatch with deploy enabled, and
   change Pages to GitHub Actions only after the artifact is approved. Verify
   the exact workflow and deploy conclusions, deployment record, public URL,
   artifact digest, asset hashes, route matrix, and two-request CDN behavior.
8. Roll back immediately if the artifact, route, locale, `noindex`, evidence
   disclosure, disabled action, publication warning, URL, validator, or cache
   behavior differs from the approved legacy baseline, or if both legacy and
   Actions paths remain active.
9. Preserve the historical legacy deployment evidence and append each
   validation or cutover checkpoint to the audit; never overwrite earlier
   evidence with later state.

### Authenticated approval register and QA gate closure

When a Pages source-switch checklist requests owner, security, CI,
content/localization, QA, or release approvals:

1. Require one authenticated record per role with reviewer name, authority or
   qualification basis, evidence location, review date, decision, and actual
   sign-off date. A role label, proposed owner, user assertion, or automated
   test result is not an authenticated approval.
2. Keep missing records explicit as `Name not supplied`, `Not supplied`, and
   `Not signed`. Do not replace them with inferred identities, repository
   permissions, commit authors, or the person running the workflow.
3. Map the records to the checklist IDs. Repository-owner records are required
   for public URL, allowlist, source-change, change-window, and rollback
   decisions; security records for artifact boundaries and permissions; CI
   records for action pins and runner policy; content/localization records for
   UTF-8, locale, evidence, `noindex`, disabled-control, and gate parity; QA
   records for automated and browser matrices; and release records for CDN
   baselines, deployment execution, and rollback authority.
4. Record technical QA separately from human approval. Capture syntax, unit,
   main Playwright, static-demo Playwright, route-matrix, artifact, and CDN
   totals with exact commit and environment. A passing result may satisfy the
   evidence column but cannot populate reviewer, authority, decision, or
   sign-off fields.
5. Mark PGS-14 pending until named content/localization reviewers approve
   locale content, evidence metadata, `noindex`, disabled controls, and
   publication gates. Mark PGS-15 through PGS-17 as technical pass only until
   the named QA/content reviewers sign.
6. Do not enable the deployment variable, dispatch with `deploy=true`, change
   the Pages source, or remove the legacy path while any PGS-01 through PGS-18
   record is unsigned or any technical result is unexplained.
7. When records are supplied, verify the evidence location is reproducible,
   the authority basis matches the decision, the sign-off date is actual, and
   the approved commit/version matches the candidate. Preserve superseded
   records and append changes rather than rewriting history.

### DOCX founder-note and DRC investment-risk integration

When a founder note and a DRC investment risk / due-diligence implementation
prompt are supplied together:

1. Extract both DOCX files locally and separate founder positioning from
   implementation requirements. Do not treat a prompt as evidence of a
   credential, client relationship, legal authorization, provider approval,
   or completed technical capability.
2. Place founder positioning in the most relevant public narrative section,
   normally Home or About, and synchronize English, French, Simplified
   Chinese, and Traditional Chinese. Keep identity, evidence metadata,
   noindex, disabled controls, and publication gates unchanged.
3. Add a dedicated risk-management route only when its state is explicit:
   investment profile, evidence register, risk categories, mitigation,
   monitoring, report, and professional-review escalation. A browser route is
   not a completed AI or diligence engine.
4. Keep Claude credentials server-side. Implement a narrow adapter boundary
   that refuses analysis unless an approved endpoint, model, API key,
   retention policy, source policy, and professional-review gate are present.
   Never fabricate provider output, citations, sanctions results, monitoring
   alerts, company records, or government data.
5. Persist investment assessments, evidence, findings, and professional-review
   queue items through Prisma models and migrations. Include ownership checks,
   reviewer RBAC, status transitions, auditability, and a memory fallback only
   for explicitly gated development mode.
6. Expose only authenticated APIs: owners may create/read their assessments;
   AI or legal reviewers may add findings and queue analysis; approved
   reviewers may process the professional-review queue. Cross-user access,
   unauthenticated writes, and publication of analysis remain denied.
7. Mirror only browser-safe route, copy, and test changes into the independent
   static-demo repository. Never copy server, Prisma, credential, upload,
   authentication, or confidential-submission capabilities into the mirror.
8. Add tests for Prisma schema/migration shape, ownership and RBAC denial,
   fail-closed Claude configuration, assessment/evidence/finding persistence,
   professional-review status transitions, four-locale risk-route rendering,
   and static-demo parity.
9. Run syntax, unit, main Playwright, static-demo Playwright, and any live
   Prisma contract suite independently. Report skipped or blocked provider
   checks separately from passing browser evidence.

### Claude server-side configuration and deployment requirement

When the Claude adapter is refusing execution or a server-side configuration
DOCX is supplied:

1. Read the adapter implementation first. Use its actual environment-variable
   contract; do not invent aliases or silently rename existing variables.
   Record the enablement flag, API-key name, model, token limit, timeout,
   endpoint/base URL, environment mode, risk-engine flag, and approval
   conditions.
2. Preserve the trust boundary:
   `browser -> existing backend -> Claude adapter -> Anthropic API`.
   The Anthropic credential must remain server-side and must never appear in
   browser JavaScript, HTML, public configuration, client bundles, source
   control, screenshots, or test output.
3. Keep the adapter disabled unless every required secret, model, endpoint,
   environment, authorization, retention, source-policy, and professional-
   review condition is valid. Return a clear structured configuration error
   such as `Claude analysis unavailable - server-side configuration is
   incomplete`; never simulate output, fabricate sources, or mark an
   assessment AI-reviewed.
4. Expose only a non-secret diagnostic status through an authenticated
   administrative health check. It may report enabled/disabled, credential
   present, model present, adapter initialized, connectivity state, last
   successful request timestamp, and sanitized configuration errors. It must
   never return a key, token, request body, confidential document, or raw
   provider response.
5. Enforce production controls at the backend boundary: authentication,
   reviewer authorization, request-schema validation, maximum request/document
   size, maximum output tokens, request timeout, bounded retries, rate limits,
   user/project usage limits, structured redacted logging, and usage/cost
   monitoring. Do not log full investment documents unless explicitly needed.
6. Separate provider evidence into three states:
   `NOT_CONFIGURED`, `CONFIGURED_CONNECTIVITY_FAILED`, and
   `CLAUDE_EXECUTED`. A configured key without a successful authenticated
   request is not operational evidence and cannot close an AI or publication
   gate.
7. Prefer an approved server or serverless runtime with secret injection
   (for example Cloud Run or another approved target). Do not describe a
   provider's free infrastructure allowance as free Anthropic inference.
   Record deployment target, secret scope, authorization owner, and rollback
   evidence separately from browser and database evidence.
8. Run the end-to-end path only with approved secrets:
   investment assessment -> backend -> adapter -> provider -> structured
   analysis -> evidence/findings -> review queue -> saved assessment.
   Mark the live track `BLOCKED` when any required secret, provider approval,
   network path, database, reviewer gate, or cost control is absent.
