# Mobile Service-Detail Refinement Implementation Plan

**Prepared:** September 18, 2026  
**Scope:** Main application and browser-only static-demo service-detail routes  
**Status:** Implementation plan only; no UI changes in this document  
**Primary objective:** Improve navigation and scanning on long mobile
service-detail pages without hiding, weakening, or reclassifying evidence,
scope limitations, disabled controls, or publication gates.

## Current Baseline

The existing service-detail route renders:

- A detail header with fixture status, service category, title, and summary.
- Audience, included-scope, and excluded-scope detail blocks.
- A `.service-evidence` block containing jurisdiction relevance, review status,
  and external references.
- An `.action-panel` containing the service notice, booking state, and disabled
  control where booking is not approved.
- Four-locale content for English, French, Simplified Chinese, and Traditional
  Chinese.

Current regression coverage checks all 14 services in all four locales,
requires `data-evidence-status="pending"`, requires at least one reference, and
verifies the expected enabled or disabled booking state.

## Non-Negotiable Safeguards

The implementation must preserve:

- Every audience, included-scope, excluded-scope, jurisdiction, evidence-status,
  review-status, and reference value.
- `fixture: true` and `evidenceStatus: "pending"` where currently configured.
- Existing disabled booking, purchase, or other transaction controls.
- The explanatory text associated with each disabled control.
- `noindex`, browser-only boundaries, safe external-link attributes, and
  localized publication warnings.
- Independent legal, identity, jurisdiction, source-currentness,
  republication-permission, and qualified-translation gates.
- The existing desktop information architecture unless a verified desktop
  defect is found during implementation.

No collapsed disclosure, anchor control, visual treatment, or passing automated
test may be treated as approval to publish a service or enable a transaction.

## Proposed Mobile Structure

### 1. In-Page Anchor Navigation

Add a localized navigation region immediately after the detail header:

- Overview
- Scope
- Evidence
- DRC relevance
- Limitations and availability

Implementation requirements:

- Use a semantic `<nav>` with a localized accessible label.
- Use normal fragment links rather than script-only controls.
- Give each target a stable, unique ID that does not depend on translated text.
- Apply `scroll-margin-top` so sticky headers do not obscure the target.
- Preserve browser history and direct fragment navigation.
- Use a horizontally scrollable row on narrow screens only when all items
  cannot fit; it must not create page-level horizontal overflow.
- Keep each anchor at least 44 CSS pixels high.
- Do not use a permanently sticky mobile element if it obscures headings,
  evidence notices, or the Back to Top control.

Recommended stable target IDs:

- `service-overview`
- `service-scope`
- `service-evidence`
- `service-drc-relevance`
- `service-limitations`

### 2. Accessible Evidence Disclosure

Retain the evidence heading and pending status in the always-visible page flow.
Place the detailed jurisdiction text, professional-review status, and reference
list inside a native `<details>` element on mobile.

Implementation requirements:

- Use `<details>` and `<summary>` rather than a custom div/button accordion.
- Keep the evidence-status badge and a concise localized pending notice outside
  the collapsed content.
- Localize the summary label in all four locales.
- Preserve source title, issuing body where available, date, citation text,
  URL, jurisdiction note, review status, and publication-permission state.
- Preserve `target="_blank"` with `rel="noopener noreferrer"` on external
  links.
- The disclosure must be open by default at desktop widths and closed by
  default only at the agreed mobile breakpoint.
- A user-opened disclosure must not unexpectedly close during same-route
  interactions.
- Keyboard focus must remain visible on the summary and every reference link.
- Screen readers must receive the native expanded/collapsed state.
- Do not truncate reference titles or hide evidence fields with line clamping.

If responsive default state cannot be implemented without replacing the
element or losing user state, use the same closed-by-default behavior at all
viewports rather than introducing brittle viewport-script behavior.

### 3. Scope And Density Refinement

Group the existing audience, included-scope, and excluded-scope blocks under the
stable `service-scope` target while preserving separate headings.

Mobile-only presentation:

- Reduce `.detail-block` vertical padding from the current large-screen rhythm
  to a compact but readable value.
- Retain a visible divider or spacing boundary between included and excluded
  scope.
- Keep paragraph line height at or above the existing body-text line height.
- Avoid cards inside cards and avoid converting every paragraph into a separate
  bordered panel.
- Do not reduce body text below the existing mobile size.
- Do not collapse exclusions by default; limitations must remain immediately
  visible.

### 4. Action And Gate Placement

On mobile, place the action panel after the limitations and evidence sections.

Requirements:

- Preserve the current desktop sticky action panel.
- Keep the mobile action panel non-sticky.
- Keep disabled controls visibly disabled and programmatically disabled.
- Put the localized disabled-state explanation immediately before or after the
  disabled control.
- Do not add an enabled substitute CTA that bypasses the approval gate.
- Preserve `aria-live` result regions where currently used.
- Confirm that the Back to Top control and action panel do not overlap.

## Implementation Boundaries

Expected main-repository files:

- `app.js`: localized anchor labels, stable section IDs, semantic navigation,
  native evidence disclosure, and gate-adjacent action explanation.
- `styles.css`: mobile anchor-row, disclosure, focus, scroll-margin, spacing,
  and action-panel rules.
- `tests/e2e/platform.spec.mjs`: main-route interaction and safeguard tests.
- `tests/e2e-static/static-demo.spec.mjs`: browser-only mirror route matrix and
  responsive checks.

Expected static-demo files:

- `static-demo/app.js`
- `static-demo/styles.css`

Do not copy server routes, authentication, database, payment, confidential
intake, or provider integrations into the static-demo repository.

## Implementation Sequence

1. Add localized labels and stable IDs without changing visual layout.
2. Add the semantic anchor navigation and verify fragment targeting.
3. Convert evidence details to native disclosure markup while keeping status
   and gate text always visible.
4. Add mobile-only density and focus styling.
5. Reposition or restyle the mobile action panel without changing its state.
6. Mirror the reviewed browser-only changes into `static-demo`.
7. Run focused tests, then complete regression suites.
8. Capture representative screenshots in all four locales.
9. Commit main and static-demo repositories separately by exact path.
10. Publish only after the static-demo commit has passed exact-commit Pages and
    public-content verification.

## Regression Coverage

### Focused Main And Static Tests

For each locale (`en`, `fr`, `zh`, `zh-Hant`) and each of the 14 services:

- The page has one H1 and the correct localized service title.
- The anchor navigation has a localized accessible name.
- All required anchors point to unique existing IDs.
- Activating each anchor moves focus or scroll position to the correct section
  without changing route or locale.
- `data-evidence-status` remains `pending`.
- The pending evidence notice remains visible while evidence details are
  collapsed.
- Evidence disclosure expands and collapses with mouse, keyboard Enter, and
  keyboard Space behavior provided by native semantics.
- Expanded evidence contains the jurisdiction text, professional-review status,
  and at least one reference.
- Every external reference retains safe-link attributes.
- Audience, included scope, and excluded scope remain non-empty.
- Non-approved booking controls remain disabled.
- The approved development fixture, if retained, remains the only explicitly
  enabled service action.
- Disabled-control explanatory text remains visible.
- `noindex` remains present.

### Responsive Matrix

Test representative service details at:

- Mobile portrait: `390 x 844`
- Mobile landscape: `844 x 390`
- Tablet: `768 x 1024`
- Laptop: `1366 x 768`
- Desktop: `1440 x 1000`

Assertions:

- No document-level horizontal overflow.
- Anchor targets are not obscured by the site header.
- Anchor and summary controls meet the 44px touch-target requirement.
- Focus indicators are visible and not clipped.
- Disclosure content does not cause layout overlap.
- Long French and Chinese labels wrap or scroll within their own controls.
- The mobile action panel does not overlap the Back to Top control.
- The desktop action panel remains sticky and readable.

### Accessibility Checks

- Run the existing accessible-route checks.
- Add automated checks for duplicate IDs, empty landmark labels, invalid
  `aria-*` attributes, and heading-order regressions.
- Verify keyboard-only navigation from the header through anchors, disclosure,
  references, disabled action, and Back to Top.
- Verify native disclosure state in the accessibility tree.
- Do not place focus on disabled buttons.

### Complete Suites

After the focused tests pass:

- Run JavaScript syntax validation.
- Run the full unit suite.
- Run the complete main Playwright suite.
- Run the named static-demo Playwright suite.
- Run strict UTF-8 and mojibake checks on all four locale sources and tests.

Live Prisma, authentication, and RBAC evidence remains a separate verification
track because this change is browser presentation and does not authorize
database or provider claims.

## Visual Review Evidence

Capture at minimum:

- One short service and one longest-content service.
- English, French, Simplified Chinese, and Traditional Chinese.
- Mobile portrait and desktop.
- Evidence disclosure closed and open.
- The anchor row at the top of the detail content.
- The disabled action panel and its explanation.
- A focused keyboard state on the summary and one anchor.

Record viewport, locale, route, disclosure state, commit, and screenshot path.
Classify visual observations as defects, optional refinements, or approval-gate
issues.

## Acceptance Criteria

Implementation is technically complete only when:

- All 56 service-locale routes retain their evidence and scope data.
- Every required anchor works and all IDs are unique.
- Evidence details are accessible without being permanently expanded on mobile.
- Pending status and publication gates remain visible at all times.
- Disabled controls remain disabled with adjacent explanation.
- No responsive overflow, touch-target, focus, or overlap defect remains.
- Main and static-demo regression suites pass.
- Main and static-demo commits contain only reviewed implementation and tests.
- A later Pages deployment is tied to the exact static-demo commit and verified
  through workflow, artifact digest, deployment URL, CDN headers, and public
  browser behavior.

Qualified legal, jurisdiction, source-currentness, permission, accessibility,
and translation approvals remain independent and fail closed.

