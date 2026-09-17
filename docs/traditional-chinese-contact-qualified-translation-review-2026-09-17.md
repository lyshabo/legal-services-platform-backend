# Traditional Chinese Contact Qualified-Translation Review Checklist

**Prepared:** September 17, 2026

**Status:** `IN_REVIEW`

**Production publication gate:** `BLOCKED`

**Temporary static-demo status:** Deployed for technical review; not approved as
qualified translation or production legal copy.

## Controlled Source

**Main repository commit:** `efa2809cc6833ef4c0fafdaf8978cca71819f660`

**Main evidence commit:** `e97532d1c0c8cfff9fd3ae8bb58020b1980e051c`

**Static-demo commit:** `3f4ee3b3592951a2ec728aa5c5dc348771a32450`

**Locale:** `zh-Hant`

**Route:** `#/contact`

The main and static-demo locale objects are synchronized. Browser and
deployment checks confirm rendering and implementation only. They do not
constitute qualified translation, legal-effect, privacy, jurisdiction, or
publication approval.

## Controlled Copy

| Field | Traditional Chinese copy |
|---|---|
| Page title | `聯絡` |
| Introduction | `此開發表單用於示範驗證及建立服務關係前的提示，不會向外部服務傳送資料。` |
| Name label | `姓名` |
| Email label | `電子郵件` |
| Message label | `留言` |
| Required marker | `必填` |
| Pre-submission notice | `提交此表單不會建立專業關係，不保證保密或受理，也不會保障任何期限。` |
| Local-validation result | `您的開發環境留言已在本機通過驗證。沒有向外部傳送資料。` |

## Required Reviewers

Do not replace a placeholder or mark a row approved without an authenticated
review record containing the reviewer's name, qualification or authority
basis, target region, decision, review date, sign-off date, and reproducible
evidence location.

| Review track | Required reviewer | Qualification or authority basis | Target region | Status |
|---|---|---|---|---|
| Traditional Chinese language | Name required | Qualified professional translator, legal translator, or demonstrably equivalent Traditional Chinese legal-language expertise | Region-specific; see below | Open |
| Legal effect and professional relationship | Name required | Authorized legal reviewer for the applicable service and publication jurisdictions | Each intended operating jurisdiction | Open |
| Privacy and data-flow statement | Name required | Privacy counsel or authorized privacy reviewer with access to the approved technical data-flow record | Each intended operating jurisdiction | Open |
| Product and technical accuracy | Name required | Engineering or product owner authorized to verify the deployed form behavior and provider mode | Browser-only demo and intended production environment separately | Open |
| Final publication authorization | Name required | Designated content or launch approver authorized to open the production publication gate | Approved production audience | Open |

## Regional Translation Tracks

Approval for one Traditional Chinese region must not be treated as approval for
another. Record separate decisions where the terminology, professional-title
rules, privacy expectations, or legal-effect language differs.

| Region | Required terminology decisions | Qualified reviewer | Review date | Decision | Sign-off date |
|---|---|---|---|---|---|
| Hong Kong | Confirm `聯絡`, `電子郵件`, `專業關係`, `保密`, `受理`, `期限`, and whether locally expected legal-service terminology requires a different formulation | Name required | Not supplied | Pending | Not supplied |
| Taiwan | Confirm `聯絡`, `電子郵件`, `專業關係`, `保密`, `受理`, `期限`, and whether `法律服務關係` or another region-specific term is more precise | Name required | Not supplied | Pending | Not supplied |
| Macau | Confirm script, legal terminology, professional-relationship language, and whether Portuguese-facing parallel copy or terminology coordination is required | Name required | Not supplied | Pending | Not supplied |
| Other Traditional Chinese audience | Define the target region before review; do not use a general `zh-Hant` approval as a substitute for jurisdiction-specific review | Name required | Not supplied | Pending | Not supplied |

## Line-by-Line Review

| ID | Copy or concept | Required review | Current technical evidence | Blocking decision |
|---|---|---|---|---|
| TC-C01 | `聯絡` | Confirm this is the preferred page and navigation label for every approved target region | Renders consistently in the deployed `zh-Hant` route | Qualified regional-language approval required |
| TC-C02 | `此開發表單用於示範驗證及建立服務關係前的提示` | Confirm naturalness, register, and accurate meaning of development demonstration and pre-engagement messaging | Main and static-demo locale objects match | Qualified translation and legal reviewer approval required |
| TC-C03 | `不會向外部服務傳送資料` | Confirm this factual statement remains true for the browser-only demo and is not reused in a production environment with notifications, analytics, logging, or other providers | Deployed static demo validates locally; no external form submission was observed | Product owner and privacy reviewer must approve separately for each environment |
| TC-C04 | `姓名` | Confirm label is natural and inclusive for the target audience | Browser assertion passed | Qualified translation approval required |
| TC-C05 | `電子郵件` | Confirm preferred regional term; document any decision to use an alternative such as region-specific email terminology | Browser assertion passed and public rendering verified | Qualified regional-language approval required |
| TC-C06 | `留言` | Confirm this label accurately describes the information requested and does not understate the sensitivity of legal inquiries | Browser assertion passed | Qualified translation, privacy, and intake-owner approval required |
| TC-C07 | `必填` | Confirm accessible and regionally appropriate required-field wording | Rendered with the form labels | Qualified translation and accessibility review required |
| TC-C08 | `提交此表單不會建立專業關係` | Confirm that the wording accurately expresses the intended no-engagement/no-client-relationship effect in every relevant jurisdiction | Visible in deployed desktop and mobile captures | Authorized legal reviewer approval required |
| TC-C09 | `不保證保密` | Confirm legal accuracy and whether a more precise confidentiality or privilege warning is required | Visible in deployed desktop and mobile captures | Legal and privacy approval required |
| TC-C10 | `或受理` | Confirm the intended meaning is non-acceptance of the matter, not merely non-receipt of the form; revise if ambiguity remains | Visible in deployed desktop and mobile captures | Legal and qualified-translation approval required |
| TC-C11 | `也不會保障任何期限` | Confirm the deadline/limitation-period warning is sufficiently clear and does not imply deadline monitoring | Visible in deployed desktop and mobile captures | Authorized legal reviewer approval required |
| TC-C12 | `您的開發環境留言已在本機通過驗證` | Confirm naturalness and distinguish local validation from transmission, receipt, review, or acceptance | Local-only result is generated after browser validation | Qualified translation and product-owner approval required |
| TC-C13 | `沒有向外部傳送資料` | Verify the statement against the actual static-demo network behavior and prohibit reuse when any external endpoint or telemetry receives form data | Static-demo implementation and browser evidence support the current browser-only behavior | Product and privacy approval required; environment-specific |

## Legal-Risk Review

The notice contains factual and implied legal-effect claims rather than
marketing puffery:

- It states that submitting the form does not establish a professional
  relationship.
- It states that confidentiality and acceptance are not guaranteed.
- It states that no deadline is protected.
- It states that no information is transmitted externally in the current
  development environment.

These statements must be reviewed together with the actual intake process,
engagement terms, privacy notice, logging and analytics configuration,
notification provider, retention rules, and jurisdictional professional-duty
requirements. No line is cleared for production solely because it is
lower-risk or technically rendered correctly.

### Official-Source Review Baseline

The following official materials were checked on September 17, 2026. They are
used to identify issues for qualified review, not to approve the copy or give a
complete jurisdictional opinion:

- Hong Kong Office of the Privacy Commissioner for Personal Data, guidance on
  Personal Information Collection Statements and Data Protection Principle
  1(3). The guidance identifies purpose, classes of transferees,
  obligatory/voluntary provision and consequences, access/correction rights,
  and the responsible contact as core collection-notice content.
- Taiwan Ministry of Justice, Personal Data Protection Act, including Articles
  3 and 8 in the official law database. The official text identifies data
  subject rights and notification items including collector identity, purpose,
  data classification, use period/area/recipients/method, rights and exercise
  methods, and the effect of declining to provide data.
- Macao Personal Data Protection Bureau, guidance on data-subject rights and
  personal-data processing notifications. The guidance identifies controller
  identity, processing purposes, recipients where applicable,
  obligatory/voluntary responses and consequences, access/correction rights,
  and an Internet-transmission risk warning as relevant collection-notice
  considerations.

These sources reinforce that the current one-sentence development notice must
not be reused as a complete production privacy collection statement.

## Line-by-Line Risk Calls

The calls below address wording risk only. `Lower-risk draft` means a candidate
for qualified reviewer consideration, not approved replacement copy.

| ID | Type | Risk call | Reason | Lower-risk draft direction |
|---|---|---|---|---|
| TC-C01 | Descriptive label | Low, region-dependent | `聯絡` is understandable, but the preferred public-facing label may differ by house style and region | Retain provisionally; reviewer may select `聯絡我們` where a more explicit navigation label is preferred |
| TC-C02 | Factual and implied process statement | Needs rewording | `建立服務關係前的提示` is formal and may not clearly explain that the page is only a browser demonstration | State directly that this is a development demonstration and that required-field checks occur in the browser |
| TC-C03 | Absolute factual statement | High; environment-specific | `不會向外部服務傳送資料` can be false if analytics, logging, error monitoring, a notification provider, hosting logs, or another endpoint receives form-related data | Limit the statement to the contact-form content and verified behavior: the demonstration does not submit the entered form content through the Contact form |
| TC-C04 | Data-field label | Low | `姓名` is conventional, but collection necessity and data minimization remain product/privacy questions | Retain only if name is necessary for the approved intake purpose |
| TC-C05 | Data-field label | Low, region-dependent | `電子郵件` is broadly understandable; regional house style may prefer another formulation | Retain provisionally and record the region-specific terminology decision |
| TC-C06 | Data-field label and implied scope | Medium | `留言` may invite confidential, privileged, sensitive, or deadline-critical facts without warning users before they type | Prefer `查詢內容` or an approved regional equivalent and place a do-not-submit-sensitive-information warning before the field |
| TC-C07 | Accessibility/instruction | Low | `必填` is clear, but required status must also be programmatically exposed and the consequence of non-provision may need disclosure in a production collection notice | Retain with accessibility verification; add production PICS/PDP notice content separately |
| TC-C08 | Legal-effect statement | High; jurisdiction-specific | `專業關係` may be broader or less precise than the intended lawyer-client, counsel-client, or engagement relationship | Use an approved region-specific term such as `律師與客戶關係`, `律師委任關係`, or `專業委聘關係` only after legal and translation review |
| TC-C09 | Legal-effect and privacy statement | High | `不保證保密` may be read as partial confidentiality, may not address legal professional privilege, and does not tell the user what not to submit | State affirmatively that users should not submit confidential, privileged, highly sensitive, or deadline-critical information before engagement is confirmed |
| TC-C10 | Legal-effect statement | High; ambiguous | `受理` can mean receipt, acceptance, processing, or formal acceptance of a matter | Replace with explicit language that submission does not mean the firm/platform has agreed to act on or accept the matter |
| TC-C11 | Deadline statement | High | `保障任何期限` is concise but does not identify statutory, contractual, filing, or procedural deadlines and may not tell users what action to take | State that the form must not be relied on to preserve statutory, contractual, filing, limitation, or procedural deadlines and direct urgent users to an approved channel |
| TC-C12 | Factual status message | Medium | `留言已在本機通過驗證` may sound like substantive review or successful receipt rather than format validation | Say that the browser completed field-format validation only; no legal or substantive review occurred |
| TC-C13 | Absolute factual status message | High; environment-specific | `沒有向外部傳送資料` is broader than the form behavior and could be contradicted by other page-level network requests | State narrowly that the entered Contact-form content was not submitted through this demonstration; verify again whenever providers or telemetry change |

## Gated Regional Draft Variants

These drafts do not modify the website. They are alternatives for named,
qualified reviewers to revise, approve, or reject. The target business entity,
controller identity, approved privacy notice, urgent-contact pathway, and
engagement terminology must be supplied before any variant can be finalized.

### Hong Kong Reviewer Draft

**Introduction**

`此為開發示範表單，只會在您的瀏覽器中檢查必填欄位及格式；本聯絡表單不會提交您輸入的內容。請勿在此輸入機密、受法律專業保密權保障、高度敏感或涉及期限的資料。`

**Pre-submission notice**

`提交此表單不會建立律師與客戶關係，亦不表示任何事項已獲接受或同意處理。請勿依賴此表單保障任何法定、合約、申索或程序期限。`

**Local-validation result**

`您的瀏覽器已完成欄位格式檢查；輸入內容並未透過本聯絡表單提交，亦未經法律或實質審閱。`

**Open Hong Kong decisions**

- Confirm whether `律師與客戶關係` or `專業委聘關係` fits the approved
  operating model.
- Provide a separate Personal Information Collection Statement before any
  production collection, covering the approved controller, purpose,
  transferees, voluntariness/consequences, access/correction rights, and
  contact point.
- Confirm the terminology for legal professional privilege and the approved
  urgent-contact route.

### Taiwan Reviewer Draft

**Introduction**

`此為開發示範表單，僅在您的瀏覽器中檢查必填欄位與格式；本聯絡表單不會送出您輸入的內容。請勿在此填寫機密、受律師保密義務或特權保障、高度敏感或涉及期限的資料。`

**Pre-submission notice**

`送出此表單不會成立律師委任關係，也不表示任何案件或事項已被接受。請勿依賴此表單保全任何法定、契約、申訴、時效或程序期限。`

**Local-validation result**

`您的瀏覽器已完成欄位格式檢查；輸入內容未透過本聯絡表單送出，也尚未經法律或實質審閱。`

**Open Taiwan decisions**

- Confirm `律師委任關係`, `案件`, `時效`, and privilege/confidentiality
  terminology with a Taiwan-qualified reviewer.
- Before production collection, supply the controller identity, purpose,
  personal-data categories, period/area/recipients/method of use, data-subject
  rights and exercise method, and effect of declining to provide the data.
- Confirm the approved urgent-contact route and whether `申訴` is relevant to
  the intended services.

### Macau Reviewer Draft

**Introduction**

`此為開發示範表單，僅在您的瀏覽器中檢查必填欄位及格式；本聯絡表單不會提交您輸入的內容。請勿在此輸入機密、高度敏感、受專業保密保障或涉及期限的資料。`

**Pre-submission notice**

`提交此表單不會建立律師與當事人或其他專業委任關係，亦不表示任何事項已獲接受或同意處理。請勿依賴此表單保障任何法定、合約、時效或程序期限。`

**Local-validation result**

`您的瀏覽器已完成欄位格式檢查；輸入內容並未透過本聯絡表單提交，亦未經法律或實質審閱。`

**Open Macau decisions**

- Confirm whether `律師與當事人關係`, `專業委任關係`, `時效`, and
  confidentiality terminology align with the approved Chinese legal register.
- Determine whether coordinated Portuguese copy is required for the approved
  audience and operating model.
- Before production collection, provide the controller identity, purposes,
  recipients, obligatory/voluntary response and consequences,
  access/correction process, Internet-transmission warning, and any required
  processing or cross-border-transfer notification evidence.

## Production Notice Separation

Even after one regional draft is approved, keep these layers separate:

1. **Contact-page safeguard:** no relationship, no acceptance, no deadline
   protection, and no sensitive information before engagement.
2. **Personal-data collection notice:** controller, purposes, data fields,
   recipients/transferees, use details, rights, contact point, retention, and
   other jurisdiction-required information.
3. **Privacy policy:** the broader processing, security, provider,
   cross-border-transfer, retention, complaint, and rights framework.
4. **Engagement terms:** the separate process by which a professional
   relationship is accepted and confirmed.

Do not rely on the short Contact notice to perform all four functions.

## Technical Verification Already Completed

| Check | Result |
|---|---|
| Main/static locale synchronization | Pass |
| Exact displayed page title | `聯絡` |
| Exact displayed email label | `電子郵件 必填` |
| Desktop rendering | Pass; no horizontal overflow or page errors |
| Mobile rendering | Pass; no horizontal overflow or page errors |
| `<html lang>` | `zh-Hant` |
| Robots control | `noindex, nofollow, noarchive` retained |
| Static-demo Playwright Contact assertion | Pass |
| GitHub Pages source commit | `3f4ee3b3592951a2ec728aa5c5dc348771a32450` |
| Pages workflow run | `35186910257` (`success`) |
| Artifact digest | `sha256:b96e209abdf69f03f17caff85867107bcefd7ea847d9f863d58521552ba15d26` |

Technical verification is not a substitute for any open reviewer decision.

## Evidence Locations

- `i18n.js`
- `static-demo/i18n.js`
- `tests/e2e-static/static-demo.spec.mjs`
- `docs/repository-cleanup-decision-log-2026-09-01.md`
- `.tmp-static-review/deployed-3f4ee3b-contact/desktop-zh-Hant-contact.png`
- `.tmp-static-review/deployed-3f4ee3b-contact/mobile-zh-Hant-contact.png`
- `.tmp-static-review/deployed-3f4ee3b-contact/evidence.json`

The `.tmp-static-review` files are temporary internal evidence and must remain
outside source control.

## Reviewer Decision Record

| Field | Entry |
|---|---|
| Reviewer name | Name required |
| Qualification or authority basis | Not supplied |
| Organization | Not supplied |
| Target region | Not supplied |
| Controlled commit/version reviewed | Not supplied |
| Terminology decisions | Not supplied |
| Legal-effect exceptions or conditions | Not supplied |
| Privacy/data-flow evidence reviewed | Not supplied |
| Decision | Pending |
| Review date | Not supplied |
| Sign-off date | Not supplied |
| Evidence location | Not supplied |

## Publication Gate

The production publication gate remains `BLOCKED` until all of the following
are recorded:

- a named qualified Traditional Chinese reviewer and region-specific decision;
- a named authorized legal reviewer for the no-relationship, confidentiality,
  acceptance, and deadline language;
- privacy and product confirmation that each data-flow statement is accurate
  for the intended environment;
- approved terminology decisions for every target region;
- a final content or launch approver, review date, decision, and actual sign-off
  date; and
- a reproducible evidence location for each approval.

The existing temporary public static demo may remain available as a
development and reviewer preview under its current `noindex` and browser-only
controls. That availability does not open the production gate.
