# Repository Cleanup Decision Log

**Date:** September 1, 2026
**Authoritative Services commit:** `bf29aa7`
**Completion commit:** `542ef6c`

## Checkpoint 1: Before Cleanup

The main repository was two commits ahead of `origin/master` after completing
the required Services renderer. Tracked modifications remained in `data.js`,
two verification reports, and several local or generated artifacts were
untracked. The nested `static-demo` repository was clean and one commit ahead
of `origin/main`.

## File Decisions

| File / artifact | Initial status | Classification | Decision | Reason / evidence | Action | Risk check |
|---|---|---|---|---|---|---|
| `app.js` | Modified | Required application and Services source plus booking-admin regression fix | PRESERVE | `bf29aa7` contained evidence labels and route call, while the required renderer was still unstaged. Full browser validation then proved the booking error-rendering hunk was required to preserve `BOOKING_NOT_PAYABLE` feedback. | Renderer committed in `542ef6c`; booking state/render fix restored after defect verification | Main route and admin booking tests cover both behaviors |
| `data.js` | Modified | Required Services source | PRESERVE | Imports `service-evidence.js`; the missing invocation is required to attach evidence and revised four-locale scope to all records | Commit the required `applyServiceEvidence(services)` invocation | Import and route tests fail without the invocation |
| `tests/e2e-static/static-demo.spec.mjs` | Modified | Required regression source | PRESERVE | Covers all 14 service routes and four locales in the browser-only mirror | Committed in `542ef6c` | Static-demo focused test passed |
| `docs/environment-secrets-audit-report.md` | Modified | Legitimate tracked evidence | PRESERVE | Records an actual fail-closed secret-channel recheck and explicitly avoids inferring live results | Commit the evidence addition | Removing it would erase verification history |
| `docs/vercel-supabase-migration-report.md` | Modified | Legitimate tracked evidence | PRESERVE | Records the corresponding blocked database, OIDC, and deployment retry | Commit the evidence addition | Removing it would erase verification history |
| `.server.pid` | Untracked | Local runtime state | IGNORE | Process ID is host-specific and is not application source | Add exact ignore rule | Server startup does not depend on a committed PID |
| `data/audit-events.jsonl`, `data/services-store.json` | Untracked | Local development persistence | IGNORE | `server-repository.mjs` creates and updates these runtime stores | Ignore `data/` | Runtime recreates the files; no production database evidence is inferred |
| `test-results/` | Untracked | Generated test output | IGNORE | Playwright-generated last-run and failure output | Add ignore rule | Test suites regenerate it |
| `.tmp-static-review/` | Untracked | Generated screenshots, traces, and patches | IGNORE | Visual-review output, not runtime source | Add ignore rule | Browser checks do not import it |
| `.skill-update/database-auth-rbac-verification.skill`, `database-auth-rbac-verification.skill` | Untracked | Packaged skill artifacts | IGNORE | Generated archives; editable skill source is already tracked under `.skill-update/...` | Ignore `*.skill` | Skill source and checklist remain tracked |
| `static-demo/` | Untracked in parent; separate Git repository | Required separate repository | IGNORE IN PARENT; PRESERVE | It has its own `.git`, branch, commit, and remote | Ignore parent path only | Nested repository remains intact and clean |
| `temp-forward-test/`, `temp-forward-test.zip` | Untracked | Isolated forward-test fixture and package | IGNORE | Not part of the production application; preserved for evidence and reuse | Add exact ignore rules | Main application has no imports from the fixture |
| Uploaded `CV Brick court.docx` and `IMG-20260830-WA*.jpg` | Untracked | Local evidence/source material | IGNORE; PRESERVE LOCALLY | Identity and image source material should not enter production source control without explicit rights and publication decisions | Add exact ignore rules | Runtime uses tracked `about-tezzeta.jpg`, not these originals |
| `portrait-contact-sheet.jpg` | Untracked | Generated visual-review artifact | IGNORE | Derived image-selection working file | Add exact ignore rule | Not referenced by runtime |
| Generated prompt Markdown files and `Legal Services Platform - Revised.docx` | Untracked | Editorial working artifacts | IGNORE; PRESERVE LOCALLY | They document prior prompt work but are not application dependencies | Add exact ignore rules | No source import or package script depends on them |
| `build_revised_legal_platform_doc.py` | Untracked | One-off editorial generator | IGNORE; PRESERVE LOCALLY | Produces a document artifact and is not used by build/test/runtime scripts | Add exact ignore rule | `package.json` contains no dependency on it |
| `scripts/readiness.mjs` | Untracked | Required application validation source | PRESERVE AND TRACK | `npm run check` and `npm run validate` call this file | Add to repository | Readiness command cannot run without it |
| `docs/architecture.md`, `implementation-status.md`, `launch-gates.md`, `threat-model.md` | Untracked | Legitimate project documentation | PRESERVE AND TRACK | Describe architecture, implementation boundaries, gates, and threat model | Add to repository | Documentation aligns with application and fail-closed launch model |
| `docs/preliminary-legal-information-translation-review.md` | Untracked | Legitimate review evidence | PRESERVE AND TRACK | Records multilingual legal-intake review boundaries | Add to repository | Supports existing four-locale guidance surface |
| `docs/refreshed-skill-forward-test-report.md` | Untracked | Legitimate verification evidence | PRESERVE AND TRACK | Records reusable-workflow forward-test findings and blockers | Add to repository | Supports the tracked reusable skill |
| `docs/website-consistency-audit-report.md` | Untracked | Legitimate audit evidence | PRESERVE AND TRACK | Documents unresolved website consistency and approval gates | Add to repository | Supports fail-closed publication decisions |

## Checkpoint 2: Cleanup Groups

1. Completed the required Services renderer and static-demo regression commit.
2. Restored the unrelated booking-admin `app.js` hunk.
3. Added exact ignore rules for local runtime state, generated verification
   output, packaged fixtures, nested repositories, and local source materials.
4. Preserved required validation source and legitimate project/evidence
   documents by adding them to source control.
5. Preserved tracked audit-history additions rather than reverting documented
   blocked checks.

## Final Summary

- **Preserved and tracked:** Services source and tests, readiness validation,
  architecture, implementation status, launch gates, threat model, translation
  review, forward-test report, consistency audit, and tracked verification
  report updates.
- **Reverted:** None. The initially questioned booking-admin hunk was retained
  after the full browser suite proved it was required behavior.
- **Deleted:** None. Potentially important local material was retained.
- **Added to `.gitignore`:** Runtime PID/data, test and screenshot output,
  packaged skills, nested repositories/fixtures, uploaded evidence, and
  generated editorial working files.
- **Investigated but retained locally:** Uploaded documents and images,
  generated prompt documents, static-demo repository, and forward-test fixture.
- **Potentially ambiguous items:** None remain unclassified.
- **Services implementation:** `bf29aa7` remains in history and its required
  renderer is completed by `542ef6c`.

## Checkpoint 3: Final Verification

- Unit tests: 18 passed, 0 failed, 1 live-Prisma test skipped because no approved
  live database was configured.
- Main Playwright: 23 passed, 0 failed, 1 obsolete test intentionally skipped,
  using one worker.
- Static-demo Playwright: 8 passed, 0 failed, using one worker.
- Focused remediation tests: assessment escalation and terminal-booking
  reconciliation both passed.
- JavaScript syntax and patch checks passed.
- Repository secret audit found no audited credential patterns or weak secret
  defaults in tracked files.
- Production readiness correctly remains `BLOCKED` by unresolved identity,
  jurisdiction, privacy, security, AI, commerce, localization, and
  non-production-provider gates.
- `bf29aa7` remains intact in commit history. `542ef6c` completes the Services
  renderer and static regression coverage; `e64d5ea` records the deliberate
  cleanup and preservation decisions.
- Final `git status`, unstaged diff, and staged diff are checked after the final
  remediation commit.

## Checkpoint 4: Corrected Pages Deployment and Public Route Verification

**Verification date:** September 14, 2026
**Static-demo source commit:** `679f1b483b1b711a3867a42626330f4790821fc7`
**Pages workflow run:** `33461712791`
**Workflow and deploy-job conclusion:** `success` / `success`
**Artifact:** `github-pages` (ID `9783378819`, 384,787 bytes)
**Artifact digest:** `sha256:5fea68b4f35f9c9cd23adcf9978f025c0e2d644f71c1ddc7bb02e963c8ca12bf`
**Deployment URL:** `https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/`

The corrected curated artifact includes `service-evidence.js`, which was
missing from the preceding `c8b942b` deployment. The public module returned
HTTP 200 and its downloaded SHA-256 matched the committed source:
`9d8ef2a0f297de43f02b238d3dcb12a3bdfd4bfb9fc3afad76cb176408e313bb`.

Two public requests were made for the root shell and the module. Both returned
HTTP 200 with `Cache-Control: max-age=600`, stable `Last-Modified` values, and
stable ETags. Each resource showed the expected cache transition from
`X-Cache: MISS`, `Age: 0` to `X-Cache: HIT`, `Age: 3`, `X-Cache-Hits: 1`.

The deployed browser verification covered all 14 service detail routes in each
of `en`, `fr`, `zh`, and `zh-Hant` (56 route-locale combinations). All 56
checks passed. Evidence status remained `pending` for every service; the
orientation service was the only route with booking enabled, and the other
13 routes remained disabled as required by the browser-only publication gate.

## Checkpoint 5: Supplied DRC Source Clarifications

The supplied `The Democratic Republic of the Congo Laws 2.docx` and
`about and experience.docx` were reviewed as source requests. They identify
additional gated Legal Library subjects (including constitutional materials,
CENAREF, Criminal Code books, banking and credit regulation, OHADA company
law, the Digital Code, judicial-organization and dispute-resolution materials,
environmental statutes, land and property law, hydrocarbons, tax, mining, and
regional economic community instruments) and experience themes involving
extractives, infrastructure, investment, human rights, environmental matters,
tax/customs, and commercial work.

These items remain **not published** until each resource or experience entry
has a verified title, edition or effective date, jurisdiction, source location,
translation review, rights or publication permission, and an approved
lower-risk public description. The requested REC, bilateral-investment-treaty,
and regional-economic-agreement categories are therefore recorded as a
content backlog rather than inferred into the live catalog.

The supplied ONA/RDC directory page
(`https://ona-rdc.org/annuaires/mbuya-tezzeta`) was reachable on September 14,
2026 and displayed: surname `MBUYA`, postname `TEZZETA`, status `AU TABLEAU`,
order number `8132`, and bar `KINSHASA/GOMBE`. This is recorded as an
authenticated source reference for the Bar item; identity-match, scope,
current-status wording, and publication-permission decisions remain separate
review fields and are not inferred from the URL alone.

## Checkpoint 6: Gated DRC Library and Experience Deployment

**Verification date:** September 14, 2026
**Main repository commit:** `08202a6dc87c2eb57fc06f75b9fe3e4af212e9f4`
**Static-demo source commit:** `eeaf36739987165e0d79a79af12ca9a6d85f7d62`
**Pages workflow run:** `34802162536`
**Deploy job:** `103846829730`
**Workflow and deploy-job conclusion:** `success` / `success`
**Artifact:** `github-pages` (ID `10331329616`, 392,023 bytes)
**Artifact digest:** `sha256:e502a8b96b53cf57ee2c89509c46607a8045aaf1bd71eedf7c6676aef68edb14`
**Deployment URL:** `https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/`

The curated deployment added development resources for DRC laws, DRC
regulations, DRC bylaws and implementing measures, OHADA instruments, REC
regulations, bilateral investment treaties, and regional economic agreements.
All entries remain fixtures. Source text, amendment and currency review,
effective dates, republication permission, qualified legal review, and
qualified translation review remain pending. Purchase and download controls
remain disabled.

The deployed browser verification covered the seven new categories in each of
`en`, `fr`, `zh`, and `zh-Hant`, plus the DRC Constitution detail route and the
date-optional About experience set in each locale. All 36 checks passed.
Every tested category returned at least one resource, purchase controls
remained disabled, source metadata and DRC operational-relevance fields were
present, each About locale rendered 11 experience entries, and the seven new
experience themes retained evidence-pending badges.

Strict UTF-8 checks found no replacement characters or repeated-question-mark
corruption in the new static resource metadata after remediation. The
static-demo Playwright suite passed 9 of 9 tests. The main Playwright suite
passed 24 tests with one obsolete test intentionally skipped. Unit tests
passed 18 tests with one live-Prisma contract test skipped because no approved
reachable PostgreSQL configuration was available.

Two requests to the deployed root returned HTTP 200 with stable ETag
`"6aa76791-4c3"`, `Last-Modified: Mon, 14 Sep 2026 03:18:41 GMT`, and
`Cache-Control: max-age=600`; cache state changed from `MISS`, `Age: 0` to
`HIT`, `Age: 3`, `X-Cache-Hits: 1`. Two requests to `data.js` returned HTTP
200 with stable ETag `"6aa76792-d283"`, `Last-Modified: Mon, 14 Sep 2026
03:18:42 GMT`, and the same `MISS` to `HIT` transition.

The main remote `master` and static-demo remote `main` branch SHAs matched the
committed source SHAs above at verification time. Historical cleanup,
blocked-attempt, and earlier corrected-deployment evidence remains preserved
unchanged in the preceding checkpoints.

## Checkpoint 7: Standalone Selected Experience Deployment and Visual Review

**Verification date:** September 14, 2026

**Main repository commit:** `0d34ce6c9182d62b6672cd4052ad0623889966b8`

**Static-demo source commit:** `49a3e9ea748950d9d3f1c3925a69fefdbdc2a2c3`

**Pages workflow:** `Deploy static demo to GitHub Pages`

**Pages workflow run:** `34808716753`

**Deploy job:** `103865606025`

**Workflow and deploy-job conclusion:** `success` / `success`

**Artifact:** `github-pages` (ID `10333164187`, 394,568 bytes)

**Artifact digest:** `sha256:51487b98868f6fd180acdd86c26b81eb88dfa8e4ee36ff9f0c2cc2e871ec54ac`

**Artifact created:** September 14, 2026 at 05:11:45 UTC

**Artifact expiry:** September 15, 2026 at 05:11:44 UTC

**Deployment URL:** `https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/`

The workflow and deploy job both completed successfully for the exact
static-demo source commit. The deployed About route displayed the approved
identity `Tezzeta N’gungwa Mbuya`. The deployed localization asset contained
the updated identity and statement-only presentation flag.

The live visual review covered the About page in English, French, Simplified
Chinese, and Traditional Chinese at desktop (`1440 x 1000`) and mobile
(`390 x 844`) viewports. Each of the eight captures rendered 14 Selected
Experience items as standalone matter statements, with zero visible date
fields, zero separate matter titles, and zero organization labels. Evidence
status badges and DRC operational-relevance notes remained visible. No
horizontal overflow, clipping, overlapping text, broken containment, or
missing statement blocks was observed.

The desktop layouts retained a balanced two-column hero, readable identity
and professional-title wrapping, and consistent stacked experience items.
The mobile layouts stacked the portrait, headings, disclosures, statements,
relevance notes, and gates correctly. The fully expanded section remains
content-dense; French mobile was the longest capture at 14,630 pixels. This is
an optional hierarchy and scan-length refinement, not a verified functional
or responsive-layout defect. Any later density reduction must preserve every
evidence field, DRC relevance note, `noindex` control, and publication gate.

Two requests to the deployed root document returned HTTP 200 with
`Content-Type: text/html; charset=utf-8`, `Content-Length: 1219`,
`Last-Modified: Mon, 14 Sep 2026 05:11:47 GMT`, stable ETag
`"6aa78213-4c3"`, and `Cache-Control: max-age=600`. The cache transitioned
from `X-Cache: MISS`, `Age: 0`, `X-Cache-Hits: 0` to `X-Cache: HIT`,
`Age: 3`, `X-Cache-Hits: 1`.

Two requests to the deployed `app.js` returned HTTP 200 with
`Content-Type: application/javascript; charset=utf-8`,
`Content-Length: 95405`, `Last-Modified: Mon, 14 Sep 2026 05:11:47 GMT`,
stable ETag `"6aa78213-174ad"`, and `Cache-Control: max-age=600`. The cache
again transitioned from `MISS`, `Age: 0`, `X-Cache-Hits: 0` to `HIT`,
`Age: 3`, `X-Cache-Hits: 1`.

The verification captures are retained as temporary internal evidence under
`.tmp-static-review/2026-09-14-about-live/` and are excluded from source
control. Browser rendering confirms implementation and responsive behavior;
it does not constitute qualified legal-claims approval, identity approval,
translation approval, source-currentness approval, or publication
authorization. Those review tracks remain separate and fail closed.

## Checkpoint 8: Fresh Pages and CDN Recheck

**Verification date:** September 14, 2026

**Exact static-demo source commit:** `49a3e9ea748950d9d3f1c3925a69fefdbdc2a2c3`

**Pages workflow run:** `34808716753`

**Workflow conclusion:** `success`

**Deploy job:** `103865606025` (`success`)

**Artifact digest:** `sha256:51487b98868f6fd180acdd86c26b81eb88dfa8e4ee36ff9f0c2cc2e871ec54ac`

**Deployment URL:** `https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/`

A fresh public recheck confirmed the exact deployed commit and successful
workflow evidence above. The root document returned HTTP 200 on both requests
with `Content-Length: 1219`, `Content-Type: text/html; charset=utf-8`,
`Last-Modified: Mon, 14 Sep 2026 05:11:47 GMT`, ETag
`"6aa78213-4c3"`, and `Cache-Control: max-age=600`. The CDN reported
`X-Cache: HIT`, `X-Cache-Hits: 1`, and increasing `Age` values of 25 and 27
seconds; the proxy layer reported `x-proxy-cache: MISS` on both responses,
which is recorded rather than interpreted as a deployment failure.

The `app.js` asset returned HTTP 200 on both requests with
`Content-Length: 95405`, `Content-Type: application/javascript; charset=utf-8`,
the same `Last-Modified` timestamp, ETag `"6aa78213-174ad"`, and
`Cache-Control: max-age=600`. It likewise reported `X-Cache: HIT`,
`X-Cache-Hits: 1`, and increasing `Age` values of 21 and 24 seconds, with
`x-proxy-cache: MISS` on both requests.

This checkpoint is append-only. It does not replace the prior visual review,
and it does not convert browser, artifact, or CDN evidence into legal,
credential, translation, or publication approval.
