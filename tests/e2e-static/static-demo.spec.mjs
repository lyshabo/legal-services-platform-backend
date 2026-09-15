import { test, expect } from "@playwright/test";

const locales = ["en", "fr", "zh", "zh-Hant"];
const demoScopeTitles = {
  en: "What this temporary demo includes",
  fr: "Contenu de cette d\u00e9monstration temporaire",
  zh: "\u6b64\u4e34\u65f6\u6f14\u793a\u5305\u542b\u7684\u5185\u5bb9",
  "zh-Hant": "\u6b64\u81e8\u6642\u793a\u7bc4\u5305\u542b\u7684\u5167\u5bb9"
};
const aboutTitles = {
  en: "International Law and Dispute Resolution",
  fr: "Droit international et règlement des différends",
  zh: "国际法与争议解决",
  "zh-Hant": "國際法與爭議解決"
};

const backToTopLabels = {
  en: "Back to top",
  fr: "Retour en haut",
  zh: "返回顶部",
  "zh-Hant": "返回頂部"
};
const publicRoutes = [
  "home",
  "services",
  "service/service-orientation",
  "book/service-orientation",
  "library",
  "product/resource-drc-constitution",
  "guidance",
  "about",
  "contact"
];

test("static About route preserves locale, resolved Bar status, and noindex", async ({ page }) => {
  for (const locale of locales) {
    await page.goto("/#/about");
    await page.selectOption("#locale-select", locale);
    await expect(page.locator("h1").first()).toHaveText("Tezzeta N’gungwa Mbuya");
    await expect(page.locator(".about-professional-title")).toHaveText(aboutTitles[locale]);
    await expect(page.locator(".about-profile")).not.toContainText(/specialist|spécialiste|专业人士|專業人士/);
    await expect(page.locator(".bar-status-panel .badge")).toBeVisible();
    await expect(page.locator(".bar-status-panel")).toContainText("Mbuya");
    await expect(page.locator(".experience-list article")).toHaveCount(14);
    expect(await page.locator(".experience-list .badge").count()).toBeGreaterThanOrEqual(7);
    await expect(page.locator(".experience-list .experience-period")).toHaveCount(0);
    await expect(page.locator(".experience-list h3")).toHaveCount(0);
    await expect(page.locator(".experience-list .about-organization")).toHaveCount(0);
    await expect(page.locator(".about-profile")).not.toContainText(/Tezzeta N[’']gungwa Mbuya/);
    await expect(page.locator(".credential-timeline article")).toHaveCount(4);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow, noarchive"
    );
    expect(await page.locator("html").getAttribute("lang")).toBeTruthy();
  }
});

test("back-to-top label and tooltip are localized in all four locales", async ({ page }) => {
  await page.goto("/#/about");
  for (const locale of locales) {
    await page.selectOption("#locale-select", locale);
    const button = page.locator("#back-to-top");
    await expect(button).toHaveAttribute("aria-label", backToTopLabels[locale]);
    await expect(button).toHaveAttribute("title", backToTopLabels[locale]);
  }
});

test("static public routes support filtering, detail navigation, and guidance intake", async ({ page }) => {
  await page.goto("/#/services");
  await expect(page.locator("#service-filters")).toBeVisible();
  const before = await page.locator("#service-results .catalog-card").count();
  await page.locator('#service-filters input[name="query"]').fill("investment");
  await page.waitForTimeout(50);
  const after = await page.locator("#service-results .catalog-card").count();
  expect(after).toBeLessThan(before);

  await page.goto("/#/library");
  await expect(page.locator("#product-filters")).toBeVisible();
  await expect(page.locator("#product-results .catalog-card")).toHaveCount(21);
  const detailHref = await page.locator("#product-results a").first().getAttribute("href");
  expect(detailHref).toMatch(/^#\/product\//);
  await page.goto(`/${detailHref}`);
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator("button[disabled]")).toHaveCount(1);

  await page.goto("/#/guidance");
  await expect(page.locator('select[name="language"]')).toBeVisible();
  await expect(page.locator('select[name="topic"]')).toBeVisible();
  await page.locator("#guidance-form button[type=submit]").click();
  await expect(page.locator("#guidance-result")).toContainText(/language|jurisdiction|topic/i);
});

test("static services expose all requested categories with gated international-law scope", async ({ page }) => {
  await page.goto("/#/services");
  for (const title of [
    "Expert Witness Services",
    "Legal Representation",
    "Legal Consultancy",
    "Environmental Law",
    "Environmental, Social and Governance (ESG) Advisory"
  ]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
  for (const category of ["expert-witness", "representation", "consultancy", "environmental-law", "esg-advisory"]) {
    await page.locator("#service-filters select[name=category]").selectOption(category);
    await expect(page.locator("#service-results .catalog-card")).toHaveCount(1);
    await expect(page.locator("#service-results .catalog-card")).toContainText("Development fixture");
    await page.locator("#service-filters select[name=category]").selectOption("all");
  }
  for (const serviceId of ["service-expert-witness", "service-legal-consultancy", "service-environmental-law", "service-esg-advisory"]) {
    await page.goto(`/#/service/${serviceId}`);
    await expect(page.locator("#main")).toContainText(/international-law/i);
    await expect(page.locator("button[data-booking]")).toBeDisabled();
  }
});

test("DRC investment-law library resources remain source-gated in all locales", async ({ page }) => {
  const categories = ["drc-laws", "drc-regulations", "drc-bylaws", "ohada", "rec-regulations", "bilateral-investment-treaties", "regional-economic-agreements"];
  for (const locale of locales) {
    await page.goto("/#/library");
    await page.selectOption("#locale-select", locale);
    for (const category of categories) {
      await page.locator("#product-filters select[name=category]").selectOption(category);
      await expect(page.locator("#product-results .catalog-card").first()).toBeVisible();
      await expect(page.locator("#product-results button[disabled]").first()).toBeVisible();
    }
    await page.goto("/#/product/resource-drc-constitution");
    await expect(page.locator(".detail-content")).toContainText(/source|来源|來源|métadonnées/i);
    await expect(page.locator(".detail-content")).toContainText(/DRC|RDC|刚果民主共和国|剛果民主共和國/i);
    await expect(page.locator("button[disabled]")).toHaveCount(1);
  }
});

test("static service details preserve evidence references and four-locale scope", async ({ page }) => {
  const serviceIds = [
    "service-orientation",
    "service-document-review",
    "service-international-arbitration",
    "service-investment-law",
    "service-cross-border-business",
    "service-extractive-industries",
    "service-business-human-rights",
    "service-afcfta-trade",
    "service-international-research",
    "service-expert-witness",
    "service-legal-representation",
    "service-legal-consultancy",
    "service-environmental-law",
    "service-esg-advisory"
  ];
  for (const locale of ["en", "fr", "zh", "zh-Hant"]) {
    for (const serviceId of serviceIds) {
      await page.goto(`/#/service/${serviceId}`);
      await page.selectOption("#locale-select", locale);
      await expect(page.locator(".service-evidence")).toHaveAttribute("data-evidence-status", "pending");
      expect(await page.locator(".service-evidence .reference-list li").count()).toBeGreaterThan(0);
      if (serviceId === "service-orientation") {
        await expect(page.locator("button[data-booking]")).toBeEnabled();
      } else {
        await expect(page.locator("button[data-booking]")).toBeDisabled();
      }
    }
  }
});

test("static admin route remains a non-authenticated demo boundary", async ({ page }) => {
  await page.goto("/#/admin");
  await expect(page.locator("body")).toContainText("temporary static demo");
  await expect(page.locator("#admin-login-form")).toHaveCount(0);
});

test("Home demo scope is localized and retains browser-only boundaries", async ({ page }) => {
  for (const locale of locales) {
    await page.goto("/#/home");
    await page.selectOption("#locale-select", locale);
    const scope = page.locator(".demo-scope-band");
    await expect(scope).toBeVisible();
    await expect(scope.locator("h2")).toHaveText(demoScopeTitles[locale]);
    await expect(scope.locator(".scope-list-available li")).toHaveCount(3);
    await expect(scope.locator(".scope-list-unavailable li")).toHaveCount(2);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow, noarchive"
    );
  }
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 }
]) {
  test(`back-to-top behavior covers every public route on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of publicRoutes) {
      await page.goto(`/#/${route}`);
      const button = page.locator("#back-to-top");
      await expect(button).toBeHidden();

      const maxScroll = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight
      );
      if (maxScroll >= 480) {
        await page.evaluate(() =>
          window.scrollTo(0, Math.min(900, document.documentElement.scrollHeight))
        );
        await expect(button, `${route} should expose the control after scrolling`).toBeVisible();
        await button.focus();
        await expect(button).toBeFocused();
        await button.click();
        expect(
          await page.evaluate(() => window.scrollY),
          `${route} should return to the top`
        ).toBeLessThan(40);
        await expect(button).toBeHidden();
      } else {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await expect(
          button,
          `${route} should stay hidden when the page cannot reach the threshold`
        ).toBeHidden();
      }
    }
  });

  test(`public routes remain accessible and overflow-free on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of ["home", "services", "library", "guidance", "about"]) {
      await page.goto(`/#/${route}`);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("nav")).toHaveAttribute("aria-label", /.+/);
      await expect(page.locator("#locale-select")).toHaveAccessibleName(/.+/);
      await expect(page.locator("a, button, select").first()).toHaveAccessibleName(/.+/);

      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(horizontalOverflow, `${route} has horizontal overflow at ${viewport.name}`).toBe(false);
    }

    await page.goto("/");
    await expect(page.locator(".demo-scope-band")).toBeVisible();
    await page.locator(".skip-link").focus();
    await expect(page.locator(".skip-link")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();

    const menu = page.locator(".mobile-menu");
    if (viewport.name === "mobile") {
      await expect(menu).toBeVisible();
      await expect(menu).toHaveAccessibleName(/.+/);
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("#primary-nav")).not.toBeVisible();
      await menu.click();
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await expect(page.locator("#primary-nav")).toBeVisible();
    } else {
      await expect(menu).not.toBeVisible();
      await expect(page.locator("#primary-nav")).toBeVisible();
    }
  });
}
