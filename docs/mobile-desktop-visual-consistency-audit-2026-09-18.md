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

## Complete 14-Service Four-Locale Route Matrix

**Verification date:** September 18, 2026

**Generated at:** `2026-09-18T21:04:38.275Z`

**Public URL:** https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/

**Matrix:** 14 service-detail routes x 4 locales x 2 viewports = **112 checks**

**Result:** **112 passed, 0 failed**

The deployed route matrix covered English (`en`), French (`fr`), Simplified
Chinese (`zh`), and Traditional Chinese (`zh-Hant`) at desktop `1440 x 1000`
and mobile `390 x 844`. Each check used a unique document request before the
hash route so that the HTTP response and rendered route were independently
recorded.

### Complete Check Results

| Check category | Failures |
| --- | ---: |
| HTTP status | 0 |
| Localized heading | 0 |
| Selected locale and `<html lang>` | 0 |
| `noindex, nofollow, noarchive` | 0 |
| Five-section navigation and target focus | 0 |
| Mobile touch-target height | 0 |
| Evidence disclosure, pending notice, and references | 0 |
| Booking-control gate state | 0 |
| Duplicate IDs | 0 |
| Broken images | 0 |
| Document-level horizontal overflow | 0 |
| Unsafe external-link attributes | 0 |
| Page errors | 0 |
| Console errors | 0 |

Every route retained the five stable targets for overview, scope, evidence,
DRC relevance, and limitations. The evidence disclosure was closed by default,
the pending evidence notice remained visible, and the cited references were
present after expansion. The orientation route retained its intentionally
enabled booking action; the other 13 routes retained disabled booking controls
and visible gate explanations.

### Page-Height Profile

Page height is recorded as a density indicator, not as a pass/fail threshold.

| Locale and viewport | Minimum | Maximum | Average |
| --- | ---: | ---: | ---: |
| English desktop | 1,791 px | 1,965 px | 1,862 px |
| English mobile | 8,792 px | 11,631 px | 9,902 px |
| French desktop | 1,818 px | 2,086 px | 1,909 px |
| French mobile | 10,097 px | 12,804 px | 11,322 px |
| Simplified Chinese desktop | 1,676 px | 1,823 px | 1,730 px |
| Simplified Chinese mobile | 7,860 px | 10,329 px | 8,690 px |
| Traditional Chinese desktop | 1,676 px | 1,823 px | 1,730 px |
| Traditional Chinese mobile | 7,880 px | 10,402 px | 8,720 px |

French pages are taller because of translation expansion, but the complete
matrix found no horizontal overflow, clipped control, hidden evidence notice,
or unreachable section. Legal Representation is the longest mobile route in
all four locales; the French mobile rendering is the matrix maximum at 12,804
pixels. The tallest desktop rendering is French ESG Advisory at 2,086 pixels.

### Service-by-Service Visual Findings

| Service route | English heading | English mobile height | References | Visual finding |
| --- | --- | ---: | ---: | --- |
| `service-orientation` | `[Placeholder] Initial legal orientation` | 8,792 px | 2 | Shortest route. The five-section index is easy to scan, the placeholder posture is visible, and booking remains intentionally enabled. |
| `service-document-review` | `[Placeholder] Document review service` | 8,803 px | 3 | Compact despite three references. Evidence metadata and the disabled-action explanation remain separated and readable. |
| `service-international-arbitration` | `International Arbitration` | 9,451 px | 2 | Moderate density. Scope, DRC relevance, limitations, and evidence retain clear visual boundaries. |
| `service-investment-law` | `International Investment Law` | 9,188 px | 2 | The title and section controls wrap without clipping. No page-level overflow or evidence loss was found. |
| `service-cross-border-business` | `Africa-Focused Cross-Border Business` | 9,384 px | 2 | The long heading wraps cleanly on mobile. The service index remains locally scrollable without widening the document. |
| `service-extractive-industries` | `Extractive Industries & Natural Resources` | 9,979 px | 3 | Higher evidence density is orderly. All three references remain available within the accessible disclosure. |
| `service-business-human-rights` | `Business & Human Rights` | 10,349 px | 2 | A longer mobile route, but the evidence notice, DRC relevance, limitations, and disabled control remain distinct. |
| `service-afcfta-trade` | `AfCFTA & African Trade Law` | 9,821 px | 1 | The single-reference evidence block is concise, and the section-navigation behavior is stable across viewports. |
| `service-international-research` | `Legal Research & International Law Consultancy` | 9,674 px | 3 | The long title wraps correctly. Three references are retained without crowding the visible pending-status notice. |
| `service-expert-witness` | `Expert Witness Services` | 10,296 px | 2 | The longer scope and limitation content remains readable; the evidence disclosure and booking gate are visible with no overlap. |
| `service-legal-representation` | `Legal Representation` | 11,631 px | 3 | Longest English mobile route and longest route in every locale. It is visually orderly and overflow-free, but remains the primary content-density outlier. |
| `service-legal-consultancy` | `Legal Consultancy` | 10,179 px | 3 | The four-locale representative review confirmed clean stacking, stable navigation, visible evidence status, and preserved gate text. |
| `service-environmental-law` | `Environmental Law` | 10,311 px | 2 | The extended mobile content keeps a consistent rhythm; evidence, DRC relevance, and limitations remain discoverable and unclipped. |
| `service-esg-advisory` | `Environmental, Social and Governance (ESG) Advisory` | 10,767 px | 3 | The longest English heading wraps cleanly. French desktop is the tallest desktop route but remains balanced and overflow-free. |

The desktop captures preserve the two-column reading structure and action
panel. Mobile captures use a single-column flow, accessible native evidence
disclosures, and locally scrollable section navigation. The review found no
visual condition that hides evidence metadata, enables a gated transaction, or
weakens a publication warning. The remaining observation is density on the
longest mobile pages, particularly Legal Representation, rather than a
responsive defect.

### Audit-Harness Corrections

The initial audit attempt produced false failures because hash-only navigation
does not create a new document response and because the pending notice was
queried with the obsolete selector `.evidence-status-note`. The final run:

- forced a new document response with a unique query parameter before each
  hash route; and
- used the rendered selector `.evidence-status-notice`.

After those harness corrections, the same deployed product completed all 112
checks with zero failures. The initial harness output is not classified as a
site regression.

### Evidence Package

- Structured report:
  `.tmp-static-review/all-service-details-public-2026-09-18/report.json`
- Screenshot directory:
  `.tmp-static-review/all-service-details-public-2026-09-18/`
- Screenshot count: 112 PNG files
- Evidence archive:
  `.tmp-static-review/all-service-details-public-2026-09-18.zip`
- Archive contents: 112 screenshots plus `report.json`
- Archive SHA-256:
  `A90DCE3EEE2C31B5F919923962B369D8BC23862297D7F249DBE9B40DC49A88A6`

This matrix is technical browser and visual evidence only. It does not approve
legal claims, identity, jurisdiction, source currentness, republication
permission, accessibility, qualified translation, or production publication.
Those review and sign-off gates remain separate and unchanged.

## Legal Representation and ESG Advisory Density Refinement

**Implementation and review date:** September 19, 2026
**Scope:** `service-legal-representation` and `service-esg-advisory`
**Locales:** English (`en`), French (`fr`), Simplified Chinese (`zh`), and
Traditional Chinese (`zh-Hant`)
**Viewports:** desktop `1440 x 1000` and mobile `390 x 844`

This refinement is structural and density-focused. It does not rewrite service
claims, remove scope limitations, alter citations, change evidence status, or
open any booking or publication gate. The same implementation is present in
the main repository and the browser-only `static-demo` mirror.

### Implemented refinements

- Added a localized “On this page” label above the five existing section
  controls for the two dense routes.
- Made the section-navigation shell sticky on mobile at `top: 76px`, below
  the mobile header, while leaving desktop navigation in normal flow.
- Tightened mobile scope-block spacing and added separators between the
  audience, included, and excluded blocks.
- Added a localized reference count to the existing evidence disclosure
  summary (`3 references` in each reviewed route).
- Added accessible “back to service sections” controls after evidence and in
  the action panel. These controls return focus to the navigation shell and
  preserve reduced-motion behavior.
- Kept the pending evidence notice outside the disclosure, retained DRC
  relevance and limitations text, and kept the booking control disabled with
  its gate explanation visible.

### Four-locale screenshot findings

The refreshed evidence set is stored in
`.tmp-static-review/density-refinements-2026-09-19/` and contains 16 PNG
captures plus `results.json`.

| Route | Locale | Desktop height | Mobile height | Overflow | Mobile nav | References | Gates |
| --- | --- | ---: | ---: | --- | --- | ---: | --- |
| Legal Representation | English | 1,917 px | 11,708 px | none | sticky | 3 | pending / disabled |
| Legal Representation | French | 2,038 px | 12,933 px | none | sticky | 3 | pending / disabled |
| Legal Representation | Simplified Chinese | 1,838 px | 10,486 px | none | sticky | 3 | pending / disabled |
| Legal Representation | Traditional Chinese | 1,838 px | 10,558 px | none | sticky | 3 | pending / disabled |
| ESG Advisory | English | 2,042 px | 10,844 px | none | sticky | 3 | pending / disabled |
| ESG Advisory | French | 2,163 px | 12,481 px | none | sticky | 3 | pending / disabled |
| ESG Advisory | Simplified Chinese | 1,900 px | 9,415 px | none | sticky | 3 | pending / disabled |
| ESG Advisory | Traditional Chinese | 1,900 px | 9,408 px | none | sticky | 3 | pending / disabled |

The desktop captures retain the two-column reading structure and action panel
without introducing a new visual hierarchy or clipping. On mobile, the
sticky navigation gives both long pages a persistent orientation aid; the
scope separators make the three scope blocks easier to scan; and the return
controls provide a keyboard- and touch-accessible way back to the section
index. French remains the densest locale because of translation expansion,
while the Chinese captures are more compact. Legal Representation remains
longer than ESG Advisory in every mobile locale, but neither route shows
page-level overflow, obscured headings, or overlapping controls.

### Preservation checks

All 16 results confirmed:

- `evidenceStatus: "pending"` remains rendered and visible;
- all three evidence references remain represented in the disclosure;
- DRC relevance and limitations remain visible;
- disabled booking controls and gate explanations remain unchanged;
- no evidence metadata, source title, citation, permission field, or
  publication warning was removed or rewritten; and
- no document-level horizontal overflow was introduced.

### Verification totals

- Focused main density test: **1 passed, 0 failed**.
- Focused static-demo density test: **1 passed, 0 failed**.
- Unit suite: **18 passed, 1 skipped, 0 failed**. The live Prisma contract
  remains skipped because live database configuration is absent.
- Main Playwright suite: **26 passed, 1 skipped, 0 failed**. The historical
  CV-sourcing assertion remains skipped.
- Static-demo Playwright suite: **18 passed, 0 skipped, 0 failed**.
- Syntax and patch checks: passed for both repositories.

This section records responsive and browser evidence only. Legal claims,
identity, jurisdiction, source currentness, republication permission,
accessibility approval, qualified translation, and final production
publication remain separate approval tracks and are not changed by this
refinement.

## Public Dense-Service Verification: Pages Run 35416079826

**Verification date:** September 19, 2026
**Exact static-demo commit:** `0988835c93d6c73be47eef22dfe7db12bee31abc`
**Remote branch:** `origin/main`
**Workflow:** Deploy static demo to GitHub Pages
**Workflow conclusion:** `success`
**Deploy job:** `105824914774` (`success`)
**Deployment record:** `6536222797` (`success`)
**Artifact:** `github-pages`, ID `10576595101`, 402,502 bytes
**Formal artifact digest:** `sha256:c39466d74f988aed271bae956e1b88bfaff926540398f42880e3138cc31b398e`
**Deployment URL:** https://legal-services-platform.github.io/legal-services-platform-static-demo-20260828/
**Pages status:** `built`; workflow deployment path; HTTPS enforced

### Public asset parity

The deployed shell and required assets were fetched from the deployment URL
and compared with normalized UTF-8 copies from the exact static-demo commit:

| Asset | HTTP | Content type | Bytes | Public SHA-256 | Local parity |
| --- | ---: | --- | ---: | --- | --- |
| `index.html` | 200 | `text/html; charset=utf-8` | 1,243 | `8b11840fb51a01f3ebc89a23e4c546cee6550ebe3d51ea549e88af7ad0c19bee` | yes |
| `app.js` | 200 | `application/javascript; charset=utf-8` | 102,956 | `ed1c3d839daa0b8b7e8aaf55185ffef4a94e389b3d7a5e1ed4615d870dd74779` | yes |
| `styles.css` | 200 | `text/css; charset=utf-8` | 47,307 | `10e575548d19cc99abc8f9d2ce2c5035f827eb9d0aaafd551183afb8c00b0f91` | yes |

### CDN headers

Two sequential requests were made for each required public asset. The first
request was a cache miss; the second returned the same validator and a cache
hit:

| Asset | ETag | Last-Modified | Cache-Control | Request 1 | Request 2 |
| --- | --- | --- | --- | --- | --- |
| `index.html` | `"6aadf4de-4db"` | `Sat, 19 Sep 2026 02:35:10 GMT` | `max-age=600` | `Age: 0`, `X-Cache: MISS`, hits `0` | `Age: 4`, `X-Cache: HIT`, hits `1` |
| `app.js` | `"6aadf4de-1922c"` | `Sat, 19 Sep 2026 02:35:10 GMT` | `max-age=600` | `Age: 0`, `X-Cache: MISS`, hits `0` | `Age: 3`, `X-Cache: HIT`, hits `1` |
| `styles.css` | `"6aadf4de-b8cb"` | `Sat, 19 Sep 2026 02:35:10 GMT` | `max-age=600` | `Age: 0`, `X-Cache: MISS`, hits `0` | `Age: 3`, `X-Cache: HIT`, hits `1` |

### Live public route matrix

The corrected public-browser matrix covered both dense routes, all four
locales, and desktop/mobile viewports:

| Route | Locales | Viewports | Checks | Passed | Failed | Timeouts |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| Legal Representation | `en`, `fr`, `zh`, `zh-Hant` | 1440 x 1000; 390 x 844 | 8 | 8 | 0 | 0 |
| ESG Advisory | `en`, `fr`, `zh`, `zh-Hant` | 1440 x 1000; 390 x 844 | 8 | 8 | 0 | 0 |
| **Total** | 4 locales | 2 viewports | **16** | **16** | **0** | **0** |

Every check returned HTTP 200, the expected localized heading and language
value (`zh-Hans` for Simplified Chinese and `zh-Hant` for Traditional
Chinese), five section targets, three evidence references, a visible pending
notice, a visible gate explanation, a disabled booking control, and no
document-level horizontal overflow. Desktop navigation remained in normal
flow; mobile navigation remained sticky.

The first public-matrix attempt reported four false failures because it
expected `zh` instead of the served standards value `zh-Hans`. A second
run with the locale mapping corrected completed **16/16**, with **0
timeouts**. This is recorded as a test-harness correction, not a product
regression.

### Supplied Chrome screenshot review

The three supplied captures
`Screenshot_20260918_223747_Chrome.jpg`,
`Screenshot_20260918_223803_Chrome.jpg`, and
`Screenshot_20260918_223826_Chrome.jpg` are each 1080 x 2340 mobile Chrome
screenshots. They show the expected long-form mobile reading pattern: stacked
service content, continued vertical flow below the first viewport, and the
need for persistent section orientation on dense routes. The visible
layout does not justify reducing body text or removing evidence content.
The implemented sticky section index, tighter scope rhythm, and return-to-
sections controls address the actionable density concern while preserving
the evidence disclosure, disabled action state, and publication gate.

This checkpoint is deployment, browser, and CDN evidence only. It does not
approve legal claims, identity, jurisdiction, source currentness,
republication permission, accessibility, qualified translation, or final
production publication.
