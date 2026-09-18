# Mobile vs. Laptop/Desktop Visual Consistency Audit

**Audit date:** September 18, 2026  
**Scope:** Browser-only static demo and synchronized main stylesheet  
**Status:** PASS WITH ONE RESPONSIVE CORRECTION  
**Evidence directory:** `.tmp-static-review/visual-consistency-2026-09-18/`

## Pages Reviewed

The same routes were compared at five viewports:

- Home
- Services
- Service detail: Service Orientation
- Legal Library
- Legal Library detail: DRC Constitution
- Guidance
- About
- Contact
- Booking: Service Orientation

Viewports:

- Mobile portrait: `390 × 844`
- Mobile landscape: `844 × 390`
- Tablet: `768 × 1024`
- Laptop: `1366 × 768`
- Desktop: `1440 × 1000`

The audit produced 45 route/viewport screenshots and structured records in
`audit-final.json`. A second usability pass records control dimensions in
`usability.json`.

## Confirmed Intentional Responsive Differences

- Navigation collapses into the mobile menu below the desktop breakpoint.
- Hero and split sections stack vertically on narrower screens.
- CTA buttons become full-width and stack vertically on mobile.
- Catalog, detail, guidance, contact, and About grids collapse to one column.
- Timeline and experience entries switch from multi-column alignment to a
  readable vertical rhythm.
- Footer content changes from side-by-side alignment to a vertical flow.
- Typography scales down through the existing responsive clamps.

These differences preserve the same branding, content hierarchy, controls, and
publication safeguards; they are not defects.

## Unintended Discrepancy Found

**Page/section:** Header navigation on mobile  
**Mobile behavior:** The menu icon was reduced by flex-shrink to approximately
`38 × 42` CSS pixels, below the 44 × 44 touch-target threshold. The locale
selector was approximately 34 pixels high.  
**Laptop/desktop behavior:** Desktop navigation did not expose the reduced
mobile control.  
**Classification:** Unintended responsive accessibility/usability discrepancy.  
**Severity:** Medium.  
**Correction scope:** Global control styling, mirrored in the main and static-demo
stylesheets.

## Corrections Implemented

In `styles.css` and `static-demo/styles.css`:

- Set `.icon-button` to a fixed `44 × 44` size.
- Added `flex: 0 0 44px` so the mobile menu cannot shrink in the header.
- Set the mobile locale selector to a minimum height of `44px`.

No content, evidence metadata, noindex settings, disabled transaction controls,
or production publication gates were changed.

## Verification

- 45 route/viewport combinations rechecked.
- Zero horizontal-overflow failures.
- Zero broken-image failures.
- Zero page or console errors.
- Mobile menu measured `44 × 44`.
- Mobile locale selector measured `104.39 × 44`.
- Unit suite: **18 passed, 1 skipped, 0 failed**. The skipped test is the
  live Prisma contract test because live database configuration is absent.
- Main Playwright suite: **24 passed, 1 skipped, 0 failed**. The skipped test
  is the historical CV-sourcing assertion.
- Static-demo Playwright suite after adding the dedicated touch-target
  regression: **16 passed, 0 skipped, 0 failed**.
- The dedicated regression checks mobile portrait, mobile landscape, and tablet
  header-control touch targets. Its first run exposed the 760–1040px locale
  selector gap; the rule was extended through the complete collapsed-navigation
  breakpoint and the final run passed.

## Remaining Issues

No material visual consistency defect remains in the audited routes and
viewports. Human visual and accessibility approval remains a separate
publication gate; automated checks and screenshots do not authorize production
publication.

## Verified Pages Deployment Evidence

**Verification date:** September 18, 2026  
**Static-demo commit:** `abeb8d4f52a3eec0f42f8f9ef16adad9162339f9`  
**Remote branch:** `origin/main`  
**Workflow:** Deploy static demo to GitHub Pages  
**Run:** `35371478952` (`success`)  
**Deploy job:** `105686235031` (`success`)  
**Artifact:** `github-pages`, ID `10558383522`, 400,538 bytes  
**Artifact digest:** `sha256:a953000d6b2b6d77a54419795c3440b64734a6287ac808a57b7b0d566f2e03ee`  
**Deployment URL:** https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/  
**Pages status:** `built`; workflow deployment path; HTTPS enforced.

The deployed shell and `styles.css` returned HTTP 200. The first request
returned `Last-Modified: Fri, 18 Sep 2026 16:57:26 GMT`, `Cache-Control:
max-age=600`, `Age: 0`, and `X-Cache: MISS`. A follow-up request returned the
same validators, `Age: 27`, `X-Cache: HIT`, and `X-Cache-Hits: 1`.

The public stylesheet contains the committed `.icon-button` `44px` fixed
flex-basis, width, and height, together with the collapsed-navigation
`.locale-picker select` minimum height of `44px`.

Live browser measurements against the deployed URL:

- Mobile portrait (`390 x 844`): menu `44 x 44`; locale selector `104.39 x 44`;
  horizontal overflow: none.
- Mobile landscape (`844 x 390`): menu `44 x 44`; locale selector `104.39 x
  44`; horizontal overflow: none.
- Tablet (`768 x 1024`): menu `44 x 44`; locale selector `104.39 x 44`;
  horizontal overflow: none.

This section records technical deployment evidence only. It does not replace
human accessibility, legal, identity, jurisdiction, translation, rights, or
production-publication approval.

## Mobile Service-Detail Refinement Recommendations

The reviewed mobile service-detail capture is structurally sound and
overflow-free. The following refinements are recommended for a later focused
UI change:

- Add a compact in-page section index or anchor row for `Overview`, `Scope`,
  `Evidence`, `DRC relevance`, and `Limitations` so users can scan a long
  detail page without removing any content.
- Put source title, source type, identity-match status, and
  publication-permission status in a disclosure that is closed by default on
  mobile and fully accessible by keyboard and screen reader.
- Reduce repeated vertical spacing between adjacent scope blocks while keeping
  headings, exclusions, and localized jurisdiction caveats distinct.
- Keep the evidence-status notice adjacent to the references and keep the
  disabled purchase or booking control adjacent to its explanatory gate text.
- Preserve `fixture: true`, pending evidence, disabled transactions, noindex,
  external-link safety attributes, and all publication warnings during any
  refinement.

These are usability recommendations, not verified defects. Any implementation
should be followed by the same four-locale route matrix and mobile
overflow/touch-target regression checks.

## Verified Mobile Service-Detail Deployment Evidence

- **Verification date:** September 18, 2026
- **Main commit:** `b7452be6c7428936e930770b320fa6681a6d2f2f`
- **Static-demo commit:** `dd58f6e0a045d30e70c3250c342fdbb3c572b3b7`
- **Static-demo remote branch:** `origin/main`
- **Workflow:** Deploy static demo to GitHub Pages
- **Run:** `35392997085` (`success`)
- **Deploy job:** `105755387686` (`success`)
- **Artifact:** `github-pages`, ID `10567265298`, 401,908 bytes
- **Artifact digest:** `sha256:e2f05b543ddfcdb0574c619197f776b3582da8f9b4cbfab9f18b5e2d96f19ca4`
- **Artifact expiry:** September 19, 2026 at 20:43:35 UTC
- **Deployment URL:** https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/
- **Pages status:** `built`; workflow deployment path; public; HTTPS enforced.

The verified public assets contain the mobile service-detail navigation,
accessible evidence disclosure, stable section targets, and gate explanation
from the exact static-demo commit. The deployed JavaScript contains
`data-service-anchor`, `evidence-disclosure`, and `gate-explanation`; the
deployed stylesheet contains `.service-section-nav` and
`.evidence-disclosure`.

### CDN Evidence

The first public requests returned HTTP 200 with the following validators and
cache behavior:

| Asset | Content length | Last-Modified | ETag | Cache-Control | Age | Cache result |
| --- | ---: | --- | --- | --- | ---: | --- |
| Shell | 1,243 bytes | `Fri, 18 Sep 2026 20:43:37 GMT` | `"6aada279-4db"` | `max-age=600` | 0 | `X-Cache: MISS`; 0 hits |
| `app.js` | 100,862 bytes | `Fri, 18 Sep 2026 20:43:37 GMT` | `"6aada279-189fe"` | `max-age=600` | 0 | `X-Cache: MISS`; 0 hits |
| `styles.css` | 45,500 bytes | `Fri, 18 Sep 2026 20:43:37 GMT` | `"6aada279-b1bc"` | `max-age=600` | 0 | `X-Cache: MISS`; 0 hits |

A follow-up `styles.css` request retained the same `Last-Modified` and `ETag`
and returned `Age: 20`, `X-Cache: HIT`, and `X-Cache-Hits: 1`. This confirms
post-deployment cache propagation without treating CDN evidence as content or
governance approval.

### Representative Four-Locale Screenshot Review

The evidence set in
`.tmp-static-review/mobile-service-detail-2026-09-18/` contains 16 screenshots
and `results.json`:

- Routes: Legal Consultancy and Service Orientation.
- Locales: English, French, Simplified Chinese, and Traditional Chinese.
- Viewports: desktop `1440 x 1000` and mobile `390 x 844`.

Every captured route/locale/viewport result confirmed:

- the localized service-detail heading and navigation accessible name;
- five stable section targets: overview, scope, evidence, DRC relevance, and
  limitations;
- evidence disclosure closed by default with the pending evidence notice still
  visible;
- references retained after expansion;
- disabled booking state and visible gate explanation;
- correct `<html lang>` value; and
- no document-level horizontal overflow.

Desktop captures preserve the two-column service-detail layout and visible
action panel. Mobile captures stack the content cleanly, keep the compact
section-navigation row scrollable within its own region, and wrap the longer
French and Chinese content without page-level overflow. No screenshot-based
defect was identified that hides evidence metadata, enables a gated action, or
weakens a publication control.

### Regression Evidence

- Syntax checks: `app.js` and `static-demo/app.js` passed.
- Unit suite: **18 passed, 1 skipped, 0 failed**. The live Prisma contract
  remains skipped because the required live database configuration is absent.
- Main Playwright suite: **25 passed, 1 skipped, 0 failed**. The historical
  CV-sourcing test remains skipped.
- Static-demo Playwright suite: **17 passed, 0 skipped, 0 failed**.
- Focused main service-detail anchor test: **1 passed**.
- Focused static-demo mobile service-detail test: **1 passed**.

The first focused browser attempt exposed a smooth-scroll timing problem in the
test harness. The test was corrected to emulate reduced motion and scroll each
control into view before activation; the rerun passed. No product defect was
identified from that initial timeout.

This section records technical deployment and responsive-browser evidence
only. Legal claims, identity, jurisdiction, source currentness, republication
permission, accessibility approval, qualified translation, and final
production publication remain separate approval tracks.
