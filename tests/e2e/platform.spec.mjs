import { test, expect } from "@playwright/test";

const developmentAdminKey = process.env.E2E_DEV_ADMIN_KEY;

if (!developmentAdminKey) {
  throw new Error("E2E_DEV_ADMIN_KEY was not initialized by the Playwright configuration.");
}

test("public services API does not expose unpublished versions", async ({ request }) => {
  const response = await request.get("/api/services");
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  expect(Array.isArray(payload.services)).toBeTruthy();
  expect(payload.services.every((service) => service.status === "published")).toBeTruthy();
});

test("multilingual navigation updates visible content", async ({ page }) => {
  await page.goto("/#/home");
  await expect(page.getByRole("heading", { name: /International Law\. African Perspective\. Strategic Insight\./i })).toBeVisible();
  await page.selectOption("#locale-select", "fr");
  await expect(page.getByRole("link", { name: "Services" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Droit international\. Perspective africaine\. Éclairage stratégique\./i })).toBeVisible();
  await page.selectOption("#locale-select", "zh");
  await expect(page.getByRole("heading", { name: "国际法。非洲视角。战略洞见。" })).toBeVisible();
  await page.selectOption("#locale-select", "zh-Hant");
  await expect(page.getByRole("heading", { name: "國際法。非洲視角。策略洞見。" })).toBeVisible();
});

test("public demo link uses the approved GitHub Pages destination", async ({ page }) => {
  await page.goto("/#/home");
  const link = page.locator('a[href="https://lyshabo.github.io/legal-services-platform-backend/"]');
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(link).toHaveAttribute("rel", /noreferrer/);
  await expect(link).toHaveText("Open public static demo");
});

test("preliminary legal assessment captures structured intake and escalates urgency", async ({ page }) => {
  await page.goto("/#/assessment");
  await expect(page.getByRole("heading", { name: /Preliminary Legal Assessment/i })).toBeVisible();
  await page.locator('select[name="language"]').selectOption({ label: "English" });
  await page.locator('input[name="jurisdiction"]').fill("DEMO");
  await page.locator('select[name="issue"]').selectOption({ label: "International matter" });
  await page.locator('input[name="urgent"]').check();
  await page.locator("#assessment-form button[type=submit]").click();
  await expect(page.locator(".result-status strong")).toHaveText("ESCALATE");
});

test("guidance uses language as the first intake field and persists it in the result", async ({ page }) => {
  await page.goto("/#/guidance");
  const fields = await page.locator("#guidance-form select, #guidance-form input, #guidance-form textarea").evaluateAll((els) => els.map((el) => el.name));
  expect(fields[0]).toBe("language");
  await page.locator('select[name="language"]').selectOption("fr");
  await page.locator('select[name="jurisdiction"]').selectOption("DEMO");
  await page.locator('select[name="topic"]').selectOption("orientation");
  await page.locator("#guidance-form button[type=submit]").click();
  await expect(page.locator("[data-guidance-language]")).toHaveAttribute("data-guidance-language", "fr");
});

test("guidance presents an AI draft with explicit attorney-review boundaries", async ({ page }) => {
  await page.goto("/#/guidance");
  await page.locator('select[name="language"]').selectOption("en");
  await page.locator('select[name="jurisdiction"]').selectOption("DEMO");
  await page.locator('select[name="topic"]').selectOption("orientation");
  await page.locator("#guidance-form button[type=submit]").click();
  await expect(page.getByRole("heading", { name: "Facts provided" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verified authorities" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Draft Client-Facing Response" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Attorney Review" })).toBeVisible();
  await expect(page.getByText(/AI-generated draft for attorney verification/i)).toBeVisible();
});

test("preliminary legal assessment exposes missing, unsupported, and attorney-approved states", async ({ page }) => {
  await page.goto("/#/assessment");
  await page.locator("#assessment-form button[type=submit]").click();
  await expect(page.locator(".result-status strong")).toHaveText("MISSING_INFORMATION");
  await page.locator('select[name="language"]').selectOption({ label: "English" });
  await page.locator('input[name="jurisdiction"]').fill("UNSUPPORTED");
  await page.locator('select[name="issue"]').selectOption({ label: "International matter" });
  await page.locator("#assessment-form button[type=submit]").click();
  await expect(page.locator(".result-status strong")).toHaveText("UNSUPPORTED_JURISDICTION");
  await page.locator('input[name="jurisdiction"]').fill("DEMO");
  await page.locator('select[name="reviewState"]').selectOption("attorney_approved");
  await page.locator("#assessment-form button[type=submit]").click();
  await expect(page.locator(".result-status strong")).toHaveText("ATTORNEY_APPROVED_RESPONSE");
});

test("thought leadership evidence metadata is explicit in all locales", async ({ page }) => {
  const expected = {
    en: ["Source title", "Source type", "Identity match", "Publication permission"],
    fr: ["Titre de la source", "Type de source", "Correspondance d’identité", "Autorisation de publication"],
    zh: ["来源标题", "来源类型", "身份匹配", "发布许可"],
    "zh-Hant": ["來源標題", "來源類型", "身分匹配", "發布許可"]
  };
  for (const [locale, labels] of Object.entries(expected)) {
    await page.goto("/#/about");
    await page.selectOption("#locale-select", locale);
    await expect(page.locator(".thought-leadership-section")).toBeVisible();
    await expect(page.locator(".evidence-fields")).toHaveCount(17);
    await page.locator(".evidence-details").first().locator("summary").click();
    for (const label of labels) {
      await expect(page.locator(".evidence-fields dt", { hasText: label }).first()).toBeVisible();
    }
  }
});

test("About redesign preserves CV sourcing, publication gates, and multilingual structure", async ({ page }) => {
  const expected = {
    en: {
      headings: ["Education", "Bar Memberships & Admissions", "Selected Experience", "Counsel", "Board of Advisors"],
      title: "Dispute Resolution Specialist | PhD Candidate in Investment Arbitration",
      doctoralStatus: "PhD Candidate in Investment Arbitration"
    },
    fr: {
      headings: ["Formation", "Barreaux et admissions", "Expérience sélectionnée", "Conseil", "Conseil consultatif"],
      title: "Spécialiste du règlement des différends | Doctorante en arbitrage d’investissement",
      doctoralStatus: "Doctorante en arbitrage d’investissement"
    },
    zh: {
      headings: ["教育背景", "律师协会会员与执业资格", "精选经历", "合作律师", "顾问委员会"],
      title: "争议解决专业人士 | 投资仲裁博士研究生",
      doctoralStatus: "投资仲裁博士研究生"
    },
    "zh-Hant": {
      headings: ["教育背景", "律師公會會員與執業資格", "精選經歷", "合作律師", "顧問委員會"],
      title: "爭議解決專業人士 | 投資仲裁博士研究生",
      doctoralStatus: "投資仲裁博士研究生"
    }
  };

  await page.goto("/#/about");
  await expect(page.locator("main h1")).toHaveCount(1);
  const portrait = page.locator('.about-portrait img');
  await expect(portrait).toBeVisible();
  expect(await portrait.evaluate((image) => image.complete && image.naturalWidth > 0)).toBeTruthy();

  for (const [locale, content] of Object.entries(expected)) {
    await page.selectOption("#locale-select", locale);
    await expect(page.getByRole("heading", { name: "Tezzeta Mbuya N'Gungwa", exact: true })).toBeVisible();
    await expect(page.locator(".about-professional-title")).toHaveText(content.title);
    await expect(page.locator(".credential-timeline article").first()).toContainText(content.doctoralStatus);
    for (const heading of content.headings) {
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    }
    await expect(page.locator(".credential-timeline article")).toHaveCount(4);
    await expect(page.locator(".experience-list article")).toHaveCount(4);
    await expect(page.locator(".bar-status-panel .badge")).toBeVisible();
    await expect(page.locator(".future-team-grid .badge")).toHaveCount(2);
  }

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('.about-cta a[href="#/book/service-orientation"]')).toBeVisible();
  await expect(page.locator('.about-cta a[href="#/services"]')).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".about-hero")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
});

test("service filtering narrows catalog results", async ({ page }) => {
  await page.goto("/#/services");
  await page.locator("#service-filters input").fill("document");
  await expect(page.getByRole("heading", { name: /Document review service/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Initial legal orientation/i })).toHaveCount(0);
});

test("service category filters are localized in all four locales", async ({ page }) => {
  const expected = {
    en: ["All categories", "Advisory support", "Document review", "International Law", "Legal Research"],
    fr: ["Toutes les catégories", "Soutien consultatif", "Revue de documents", "Droit international", "Recherche juridique"],
    zh: ["所有分类", "咨询支持", "文件审查", "国际法", "法律研究"],
    "zh-Hant": ["所有類別", "諮詢支援", "文件審查", "國際法", "法律研究"]
  };
  for (const [locale, labels] of Object.entries(expected)) {
    await page.goto("/#/services");
    await page.selectOption("#locale-select", locale);
    await expect(page.locator("#service-filters option")).toHaveText(labels);
  }
});

test("legal compendium catalog remains gated with publication metadata and disabled purchase", async ({ page }) => {
  await page.goto("/#/home");
  await expect(page.getByRole("heading", { name: "Legal Compendiums" }).first()).toBeVisible();
  await page.getByRole("link", { name: "Explore Legal Compendiums" }).click();
  await expect(page).toHaveURL(/#\/library$/);
  await expect(page.locator(".publication-meta").first()).toContainText("Pending approval");
  await expect(page.locator(".catalog-card button[disabled]").first()).toBeVisible();
  await page.locator(".catalog-card a").first().click();
  await expect(page.getByText(/DEMO CONTENT/)).toBeVisible();
  await expect(page.getByText(/do not, by themselves, constitute individualized legal advice/i)).toBeVisible();
});

test("guidance refuses unsupported routes and escalates urgency", async ({ page }) => {
  await page.goto("/#/guidance");
  await page.locator('select[name="language"]').selectOption("en");
  await page.locator('select[name="jurisdiction"]').selectOption("UNSUPPORTED");
  await page.locator('select[name="topic"]').selectOption("orientation");
  await expect(page.locator('select[name="jurisdiction"]')).toHaveValue("UNSUPPORTED");
  await expect(page.locator('select[name="topic"]')).toHaveValue("orientation");
  await page.locator("#guidance-form button[type=submit]").click();
  await expect(page.locator(".result-status")).toHaveClass(/result-unsupported/);

  await page.locator('select[name="jurisdiction"]').selectOption("DEMO");
  await page.locator('textarea[name="situation"]').fill("My hearing is tomorrow");
  await page.locator('input[name="urgency"]').check();
  await expect(page.locator('select[name="jurisdiction"]')).toHaveValue("DEMO");
  await page.locator("#guidance-form button[type=submit]").click();
  await expect(page.getByText(/Prompt professional attention/i)).toBeVisible();
});

test("contact validation shows errors and local success", async ({ page }) => {
  await page.goto("/#/contact");
  await page.locator("#contact-form button[type=submit]").click();
  await expect(page.locator("#contact-form input[name=name]")).toBeFocused();
  await page.locator('input[name="name"]').fill("Test User");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator('textarea[name="message"]').fill("This is a development-only contact validation message.");
  await page.locator("#contact-form button[type=submit]").click();
  await expect(page.getByText(/validated locally/i)).toBeVisible();
});

test("launch controls support development login, versioning, and local gate state", async ({ page }) => {
  await page.goto("/#/admin");
  await page.locator("#admin-login-form input[name=key]").fill(developmentAdminKey);
  await page.locator("#admin-login-form button[type=submit]").click();
  await expect(page.getByText(/Authenticated as Development administrator/i)).toBeVisible();
  await page.locator('select[data-gate="identity"]').selectOption("in_review");
  await expect(page.locator('select[data-gate="identity"]')).toHaveValue("in_review");
  await page.locator("#service-version-form input[name=title]").fill("[Placeholder] Revised orientation");
  await page.locator("#service-version-form button[type=submit]").click();
  await expect(page.getByText(/Server-side version created/i)).toBeVisible();
  await expect(page.getByText(/service.version.created/i).first()).toBeVisible();
});

test("admin session lifecycle enforces RBAC before login and after logout", async ({ page }) => {
  const deniedBeforeLogin = await page.request.get("/api/admin/bookings");
  expect(deniedBeforeLogin.status()).toBe(401);

  await page.goto("/#/admin");
  await page.locator("#admin-login-form input[name=key]").fill(developmentAdminKey);
  await page.locator("#admin-login-form button[type=submit]").click();
  await expect(page.getByText(/Authenticated as Development administrator/i)).toBeVisible();
  expect((await page.request.get("/api/admin/bookings")).status()).toBe(200);

  await page.locator("#admin-logout").click();
  await expect(page.locator("#admin-login-form")).toBeVisible();
  const session = await (await page.request.get("/api/admin/session")).json();
  expect(session.authenticated).toBe(false);
  expect((await page.request.get("/api/admin/bookings")).status()).toBe(401);
});

test("booking loads localized slots and reconciles development payment", async ({ page }) => {
  await page.request.post("/api/dev/reset-bookings");
  await page.goto("/#/book/service-orientation");
  await expect(page.locator("#slot-select")).toBeVisible();
  await expect(page.locator('#slot-select option[value^="slot-"]')).not.toHaveCount(0);
  const slotValue = await page.locator('#slot-select option[value^="slot-"]').first().getAttribute("value");
  await page.locator("#slot-select").selectOption(slotValue);
  await expect(page.locator("#slot-select")).toHaveValue(slotValue);
  await page.locator('input[name="jurisdiction"]').fill("DEMO");
  await page.locator('input[name="name"]').fill("Test User");
  await page.locator('input[name="email"]').fill("test@example.com");
  await page.locator("#booking-form button[type=submit]").click();
  await expect(page.getByText(/Development booking hold created/i)).toBeVisible();
  await page.locator("#reconcile-payment").click();
  await expect(page.getByText(/Payment reconciled/i)).toBeVisible();
});

test("admin manages questionnaire versions, availability, and audit filters", async ({ page }) => {
  await page.goto("/#/admin");
  await page.locator("#admin-login-form input[name=key]").fill(developmentAdminKey);
  await page.locator("#admin-login-form button[type=submit]").click();
  await expect(page.getByRole("heading", { name: "Orientation intake" })).toBeVisible();
  await page.locator("#questionnaire-version-form input[name=jurisdictionLabel]").fill("Approved development jurisdiction label");
  await page.locator("#questionnaire-version-form button[type=submit]").click();
  await expect(page.getByText(/Questionnaire version created and audited/i)).toBeVisible();
  await page.locator("#availability-form input[name=startMinute]").fill("600");
  await page.locator("#availability-form input[name=endMinute]").fill("720");
  await page.locator("#availability-form button[type=submit]").click();
  await expect(page.getByText(/Availability rule created and audited/i)).toBeVisible();
  await page.locator("#audit-filter-form input[name=action]").fill("availability");
  await page.locator("#audit-filter-form button[type=submit]").click();
  await expect(page.getByText("availability.created").first()).toBeVisible();
});

test("admin filters thought leadership by identity and permission status", async ({ page }) => {
  await page.goto("/#/admin");
  await page.locator("#admin-login-form input[name=key]").fill(developmentAdminKey);
  await page.locator("#admin-login-form button[type=submit]").click();
  await expect(page.locator("#thought-leadership-filter-form")).toBeVisible();
  await expect(page.locator("#thought-leadership-admin-results > div")).toHaveCount(17);
  await page.locator("#thought-leadership-filter-form select[name=identityMatch]").selectOption("none");
  await page.locator("#thought-leadership-filter-form button[type=submit]").click();
  await expect(page.locator("#thought-leadership-admin-results > div")).toHaveCount(1);
  await page.locator("#thought-leadership-filter-form select[name=identityMatch]").selectOption("all");
  await page.locator("#thought-leadership-filter-form select[name=publicationPermission]").selectOption("development");
  await page.locator("#thought-leadership-filter-form button[type=submit]").click();
  await expect(page.locator("#thought-leadership-admin-results > div")).toHaveCount(4);
});

test("admin evidence filter labels and status options are localized", async ({ page }) => {
  const expected = {
    fr: ["Filtres de revue des preuves", "Statut de correspondance d’identité", "Autorisation en attente"],
    zh: ["证据审查筛选", "身份匹配状态", "发布许可待定"],
    "zh-Hant": ["證據審查篩選", "身分匹配狀態", "發布許可待定"]
  };
  await page.goto("/#/admin");
  await page.locator("#admin-login-form input[name=key]").fill(developmentAdminKey);
  await page.locator("#admin-login-form button[type=submit]").click();
  for (const [locale, labels] of Object.entries(expected)) {
    await page.selectOption("#locale-select", locale);
    await expect(page.getByRole("heading", { name: labels[0] })).toBeVisible();
    await expect(page.getByText(labels[1], { exact: true })).toBeVisible();
    await expect(page.locator('#thought-leadership-filter-form select[name="publicationPermission"] option[value="pending"]')).toHaveText(labels[2]);
  }
});

test("admin prevents terminal booking revival and reconciles an active booking", async ({ page }) => {
  const slotsResponse = await page.request.get("/api/booking/slots?timezone=UTC");
  const { slots } = await slotsResponse.json();
  expect(slots.length).toBeGreaterThan(0);
  const bookingResponse = await page.request.post("/api/booking", {
    data: {
      serviceId: slots[0].serviceId,
      slotId: slots[0].id,
      locale: "en",
      clientTimezone: "UTC",
      idempotencyKey: `admin-e2e-${Date.now()}`
    }
  });
  expect(bookingResponse.ok()).toBeTruthy();
  const booking = await bookingResponse.json();

  await page.goto("/#/admin");
  await page.locator("#admin-login-form input[name=key]").fill(developmentAdminKey);
  await page.locator("#admin-login-form button[type=submit]").click();
  const status = page.locator(`[data-booking-status="${booking.id}"]`);
  await expect(status).toBeVisible();
  await status.selectOption("cancelled");
  await expect(page.locator(`[data-booking-status="${booking.id}"]`)).toHaveValue("cancelled");
  await page.locator(`[data-reconcile-booking="${booking.id}"]`).click();
  await expect(page.getByText("BOOKING_NOT_PAYABLE")).toBeVisible();
  await expect(page.locator(`[data-booking-status="${booking.id}"]`)).toHaveValue("cancelled");

  const refreshedSlotsResponse = await page.request.get("/api/booking/slots?timezone=UTC");
  const { slots: refreshedSlots } = await refreshedSlotsResponse.json();
  const activeBookingResponse = await page.request.post("/api/booking", {
    data: {
      serviceId: refreshedSlots[0].serviceId,
      slotId: refreshedSlots[0].id,
      locale: "en",
      clientTimezone: "UTC",
      idempotencyKey: `admin-active-e2e-${Date.now()}`
    }
  });
  expect(activeBookingResponse.ok()).toBeTruthy();
  const activeBooking = await activeBookingResponse.json();
  await page.reload();
  const activeStatus = page.locator(`[data-booking-status="${activeBooking.id}"]`);
  await expect(activeStatus).toBeVisible();
  await page.locator(`[data-reconcile-booking="${activeBooking.id}"]`).click();
  await expect(page.getByText(/Payment reconciled and booking state refreshed/i)).toBeVisible();
  await expect(page.locator(`[data-booking-status="${activeBooking.id}"]`)).toHaveValue("confirmed");
  const auditResponse = await page.request.get("/api/admin/audit?action=payment.reconciled");
  expect(auditResponse.ok()).toBeTruthy();
  const audit = await auditResponse.json();
  expect(
    audit.events.some(
      (event) => event.actorId === "dev-admin" && event.metadata?.bookingId === activeBooking.id
    )
  ).toBeTruthy();
});
