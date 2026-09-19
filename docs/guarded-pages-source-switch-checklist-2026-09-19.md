# Guarded GitHub Pages Source-Switch Checklist

**Repository:** `lyshabo/legal-services-platform-backend`  
**Current source:** Legacy branch publishing from `master:/`  
**Current public URL:** https://lyshabo.github.io/legal-services-platform-backend/  
**Prepared:** September 19, 2026  
**Status:** `NOT APPROVED FOR CUTOVER`

This checklist governs a possible move from the legacy Pages source to the
verified GitHub Actions workflow. It is fail-closed: a skipped or incomplete
item blocks source change. The current legacy source must remain active until
all pre-cutover checks are signed off.

## Authenticated approval register

No authenticated approval records were supplied in the workspace or in the
current request. The following six role rows are therefore explicit unsigned
records, not approvals. Replace only with authenticated details supplied by the
authorized reviewer:

| Role | Reviewer name | Authority basis | Evidence location | Review date | Decision | Sign-off date |
| --- | --- | --- | --- | --- | --- | --- |
| Repository owner | `Name not supplied` | `Not supplied` | `Not supplied` | `Not supplied` | `Not signed` | `Not supplied` |
| Security reviewer | `Name not supplied` | `Not supplied` | `Not supplied` | `Not supplied` | `Not signed` | `Not supplied` |
| CI owner | `Name not supplied` | `Not supplied` | `Not supplied` | `Not supplied` | `Not signed` | `Not supplied` |
| Content/localization reviewer | `Name not supplied` | `Not supplied` | `Not supplied` | `Not supplied` | `Not signed` | `Not supplied` |
| QA owner | `Name not supplied` | `Not supplied` | `Not supplied` | `Not supplied` | `Not signed` | `Not supplied` |
| Release owner | `Name not supplied` | `Not supplied` | `Not supplied` | `Not supplied` | `Not signed` | `Not supplied` |

Technical test results below do not substitute for these role-based
approvals.

## A. Ownership and approval

| ID | Check | Owner | Evidence location | Status |
| --- | --- | --- | --- | --- |
| PGS-01 | Confirm the intended public URL and repository are unchanged | Repository owner | GitHub Pages settings; responsive audit | `PENDING` |
| PGS-02 | Approve the curated file allowlist and confirm no server, Prisma, secret, prompt, report, or temporary files are publishable | Repository owner / security reviewer | `.github/workflows/pages-curated.yml`; artifact manifest | `PENDING` |
| PGS-03 | Approve switching Pages from `master:/` to GitHub Actions | Repository owner | GitHub Pages settings change record | `PENDING` |
| PGS-04 | Record change window, operator, reviewer, and rollback authority | Repository owner | Change record | `PENDING` |

## B. Workflow and supply-chain controls

| ID | Check | Owner | Evidence location | Status |
| --- | --- | --- | --- | --- |
| PGS-05 | Review workflow permissions: `contents: read`, `pages: write`, and `id-token: write` only where required | Security reviewer | `.github/workflows/pages-curated.yml` | `PASS - reviewed` |
| PGS-06 | Confirm immutable action SHAs and release annotations | Security reviewer | Workflow; official action refs | `PASS - reviewed` |
| PGS-07 | Confirm runner policy and Node.js 24-compatible Pages actions | CI owner | Workflow; validation run `35422474597` | `PASS - reviewed` |
| PGS-08 | Confirm concurrency prevents overlapping Pages deployments | CI owner | Workflow concurrency block | `PASS - reviewed` |
| PGS-09 | Confirm deployment remains gated by both manual input and `ENABLE_CURATED_PAGES_DEPLOYMENT=true` | Repository owner | Workflow; repository variables | `PASS - gated` |

## C. Artifact and content parity

| ID | Check | Owner | Evidence location | Status |
| --- | --- | --- | --- | --- |
| PGS-10 | Curated build completes from the candidate commit | CI owner | Run `35422474597` | `PASS` |
| PGS-11 | Artifact digest and ID are recorded | CI owner | Digest `sha256:f8cfe4a360a01d77b239d6f4392eed11d897c99c8dc471763065baad5467e2ee`; artifact `10578485017` | `PASS` |
| PGS-12 | Downloaded artifact contains only the approved allowlist plus `SHA256SUMS` | Security reviewer | Artifact archive and manifest | `PASS` |
| PGS-13 | All manifest hashes recompute successfully | CI owner | Artifact `SHA256SUMS` verification | `PASS` |
| PGS-14 | Local and artifact files preserve UTF-8, locale content, `noindex`, evidence metadata, disabled controls, and publication gates | Content and localization reviewers | Browser regression results; artifact inspection | `PENDING - named reviewer and sign-off absent` |

## D. Browser and public-site parity

| ID | Check | Owner | Evidence location | Status |
| --- | --- | --- | --- | --- |
| PGS-15 | Run syntax, unit, main Playwright, and static-demo Playwright suites against the candidate commit | QA owner | Candidate commit `c8eb262`; syntax checks passed; unit `18 passed, 1 skipped, 0 failed`; main Playwright `26 passed, 1 skipped, 0 failed`; static-demo Playwright `18 passed, 0 skipped, 0 failed` | `PASS - technical evidence; QA sign-off absent` |
| PGS-16 | Run the full four-locale desktop/mobile route matrix | QA owner | Public dense-service matrix: 16 checks, 16 passed, 0 failed, 0 timeouts; prior complete 14-service matrix: 112 passed, 0 failed | `PASS - technical evidence; QA sign-off absent` |
| PGS-17 | Confirm all public links, assets, locale attributes, `noindex`, evidence disclosures, and disabled actions | QA and content reviewers | Main and static-demo Playwright results; public route matrix; artifact manifest and checksum verification | `PASS - technical evidence; content/QA sign-off absent` |
| PGS-18 | Capture baseline public asset hashes, ETags, Last-Modified, Cache-Control, Age, and cache status from the legacy URL | Release owner | CDN evidence section of responsive audit | `PASS - baseline recorded` |

## E. Controlled cutover

| ID | Check | Owner | Required action | Status |
| --- | --- | --- | --- | --- |
| PGS-19 | Enable the repository variable only after PGS-01 through PGS-18 are approved | Repository owner | Set `ENABLE_CURATED_PAGES_DEPLOYMENT=true` | `BLOCKED` |
| PGS-20 | Dispatch the workflow with `deploy=true` from the approved commit | Release operator | Record workflow, deploy job, artifact, and deployment IDs | `BLOCKED` |
| PGS-21 | Change the GitHub Pages source from legacy branch publishing to GitHub Actions | Repository owner | Make the Pages settings change; do not leave both paths active | `BLOCKED` |
| PGS-22 | Confirm the deployment environment URL resolves to the intended public site | Release operator | Pages deployment status and public URL | `BLOCKED` |

## F. Post-cutover verification

| ID | Check | Owner | Required evidence | Status |
| --- | --- | --- | --- | --- |
| PGS-23 | Compare deployed artifact digest with the approved workflow artifact | Release operator | Artifact API record | `BLOCKED` |
| PGS-24 | Recompute public asset hashes against the approved manifest | QA owner | `index.html`, `app.js`, `data.js`, `i18n.js`, `service-evidence.js`, `styles.css`, image hashes | `BLOCKED` |
| PGS-25 | Re-run four-locale desktop/mobile public-browser matrix | QA owner | Route report and screenshots | `BLOCKED` |
| PGS-26 | Confirm CDN propagation: ETag, Last-Modified, Cache-Control, Age, MISS-to-HIT behavior | Release owner | Two sequential requests per required asset | `BLOCKED` |
| PGS-27 | Confirm no legacy branch deployment remains active | Repository owner | GitHub Pages settings and deployment list | `BLOCKED` |
| PGS-28 | Record final decision, exact SHA, reviewers, date, and rollback window | Repository owner | Release record | `BLOCKED` |

## Rollback triggers

Immediately restore legacy publishing or stop the cutover if any of the
following occurs:

- artifact contents differ from the approved allowlist;
- any checksum, route, locale, `noindex`, evidence, disabled-control, or
  publication-gate check fails;
- the public URL changes unexpectedly or returns a non-200 response;
- a required asset is missing, stale, or served from an unexpected commit;
- CDN validators do not converge after the cache window;
- a second Pages deployment path remains active;
- legal, identity, source-currentness, permission, accessibility, or
  qualified-translation status is changed by inference rather than approval.

**Current decision:** Keep legacy `master:/` publishing active. The curated
workflow is validated but not deployed, and no source-switch approval has
been recorded.
