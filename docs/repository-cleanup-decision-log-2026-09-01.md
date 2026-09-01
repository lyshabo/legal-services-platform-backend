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
