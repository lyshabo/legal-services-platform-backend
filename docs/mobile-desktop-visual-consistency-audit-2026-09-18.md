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
