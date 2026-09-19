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
const contactCopy = {
  en: {
    title: "Contact",
    name: "Name",
    email: "Email",
    message: "Message"
  },
  fr: {
    title: "Contact",
    name: "Nom",
    email: "E-mail",
    message: "Message"
  },
  zh: {
    title: "联系",
    name: "姓名",
    email: "电子邮件",
    message: "留言"
  },
  "zh-Hant": {
    title: "聯絡",
    name: "姓名",
    email: "電子郵件",
    message: "留言"
  }
};
const publicRoutes = [
  "home",
  "services",
  "service/service-orientation",
  "book/service-orientation",
  "library",
  "product/resource-drc-constitution",
  "guidance",
  "risk",
  "about",
  "contact"
];
const serviceDetailNavigationLabels = {
  en: "Service detail sections",
  fr: "Sections du detail du service",
  zh: "\u670d\u52a1\u8be6\u60c5\u90e8\u5206",
  "zh-Hant": "\u670d\u52d9\u8a73\u60c5\u90e8\u5206"
};

for (const viewport of [
  { name: "mobile portrait", width: 390, height: 844 },
  { name: "mobile landscape", width: 844, height: 390 },
  { name: "tablet", width: 768, height: 1024 }
]) {
  test(`header controls preserve usable touch targets on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/#/home");

    const menuBox = await page.locator(".mobile-menu").boundingBox();
    const localeBox = await page.locator("#locale-select").boundingBox();

    expect(menuBox).not.toBeNull();
    expect(localeBox).not.toBeNull();
    expect(menuBox.width).toBeGreaterThanOrEqual(44);
    expect(menuBox.height).toBeGreaterThanOrEqual(44);
    expect(localeBox.height).toBeGreaterThanOrEqual(44);
  });
}

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

test("static Contact route uses locale-specific form copy", async ({ page }) => {
  await page.goto("/#/contact");
  for (const locale of locales) {
    await page.selectOption("#locale-select", locale);
    const expected = contactCopy[locale];
    await expect(page.locator("h1")).toHaveText(expected.title);
    await expect(page.locator('label:has(input[name="name"]) span')).toContainText(expected.name);
    await expect(page.locator('label:has(input[name="email"]) span')).toContainText(expected.email);
    await expect(page.locator('label:has(textarea[name="message"]) span')).toContainText(expected.message);
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

test("mobile service-detail navigation and evidence disclosure preserve gates in all locales", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const locale of locales) {
    await page.goto("/#/service/service-legal-consultancy");
    await page.selectOption("#locale-select", locale);
    const sectionNav = page.locator(".service-section-nav");
    await expect(sectionNav).toHaveAttribute("aria-label", serviceDetailNavigationLabels[locale]);
    await expect(sectionNav.locator("[data-service-anchor]")).toHaveCount(5);
    for (const targetId of ["service-overview", "service-scope", "service-evidence", "service-drc-relevance", "service-limitations"]) {
      await expect(page.locator(`#${targetId}`)).toHaveCount(1);
      const control = sectionNav.locator(`[data-service-anchor="${targetId}"]`);
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      expect(box.height).toBeGreaterThanOrEqual(44);
      await control.scrollIntoViewIfNeeded();
      await control.click();
      await expect(page.locator(`#${targetId}`)).toBeFocused();
      await expect(page).toHaveURL(/#\/service\/service-legal-consultancy$/);
    }
    const disclosure = page.locator(".evidence-disclosure");
    await expect(disclosure).not.toHaveAttribute("open", "");
    await expect(page.locator("[data-evidence-gate=pending]")).toBeVisible();
    await disclosure.locator("summary").scrollIntoViewIfNeeded();
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
    expect(await disclosure.locator(".reference-list li").count()).toBeGreaterThan(0);
    await expect(page.locator(".gate-explanation")).toBeVisible();
    await expect(page.locator("button[data-booking]")).toBeDisabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
  }
});

test("dense static service details improve mobile scanning without weakening gates", async ({ page }) => {
  const labels = {
    en: { onThisPage: "On this page", references: "3 references", back: "Back to service sections" },
    fr: { onThisPage: "Sur cette page", references: "3 references", back: "Revenir aux sections du service" },
    zh: { onThisPage: "\u672c\u9875\u5185\u5bb9", references: "3 \u9879\u53c2\u8003\u8d44\u6599", back: "\u8fd4\u56de\u670d\u52a1\u90e8\u5206" },
    "zh-Hant": { onThisPage: "\u672c\u9801\u5167\u5bb9", references: "3 \u9805\u53c3\u8003\u8cc7\u6599", back: "\u8fd4\u56de\u670d\u52d9\u90e8\u5206" }
  };
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const serviceId of ["service-legal-representation", "service-esg-advisory"]) {
    for (const locale of locales) {
      await page.goto(`/#/service/${serviceId}`);
      await page.selectOption("#locale-select", locale);
      const shell = page.locator("#service-section-navigation");
      await expect(shell).toHaveClass(/service-detail-density/);
      await expect(shell.locator(".service-section-nav-label")).toHaveText(labels[locale].onThisPage);
      await expect(shell.locator("[data-service-anchor]")).toHaveCount(5);
      expect(await shell.evaluate((element) => getComputedStyle(element).position)).toBe("sticky");
      expect(await shell.evaluate((element) => getComputedStyle(element).top)).toBe("76px");
      await expect(page.locator(".evidence-disclosure summary")).toContainText(labels[locale].references);
      await expect(page.locator("[data-service-section-return]")).toHaveCount(2);
      await expect(page.locator("[data-service-section-return]").first()).toHaveText(labels[locale].back);
      await page.locator("[data-service-section-return]").first().scrollIntoViewIfNeeded();
      await page.locator("[data-service-section-return]").first().click();
      await expect(shell).toBeFocused();
      const mobileLayout = await page.evaluate(() => {
        const detail = document.querySelector(".detail-layout");
        const header = document.querySelector(".detail-header");
        const action = document.querySelector(".action-panel");
        return {
          detailWidth: detail?.getBoundingClientRect().width ?? 0,
          actionWidth: action?.getBoundingClientRect().width ?? 0,
          headerWidth: header?.getBoundingClientRect().width ?? 0,
          headingSize: Number.parseFloat(getComputedStyle(header?.querySelector("h1")).fontSize)
        };
      });
      expect(Math.abs(mobileLayout.detailWidth - mobileLayout.actionWidth)).toBeLessThanOrEqual(1);
      expect(Math.abs(mobileLayout.detailWidth - mobileLayout.headerWidth)).toBeLessThanOrEqual(1);
      expect(mobileLayout.headingSize).toBeGreaterThanOrEqual(32);
      await expect(page.locator("[data-evidence-gate=pending]")).toBeVisible();
      await expect(page.locator("#service-drc-relevance")).toBeVisible();
      await expect(page.locator(".gate-explanation")).toBeVisible();
      await expect(page.locator("button[data-booking]")).toBeDisabled();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy();
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

test("founder note and DRC investment-risk architecture stay localized and fail closed", async ({ page }) => {
  const titles = {
    en: "DRC Investment Risk & Due-Diligence",
    fr: "Risque d’investissement et diligence raisonnable en RDC",
    zh: "刚果民主共和国投资风险与尽职调查",
    "zh-Hant": "剛果民主共和國投資風險與盡職調查"
  };
  for (const locale of locales) {
    await page.goto("/#/home");
    await page.selectOption("#locale-select", locale);
    await expect(page.locator(".founder-note")).toBeVisible();
    await expect(page.locator('.founder-note a[href="#/risk"]')).toBeVisible();

    await page.goto("/#/risk");
    await expect(page.locator("h1")).toHaveText(titles[locale]);
    await expect(page.locator(".risk-phase-list li")).toHaveCount(6);
    await expect(page.locator(".risk-architecture button[disabled]")).toHaveCount(1);
    await expect(page.locator(".risk-architecture")).toContainText(/Claude/);
    await expect(page.locator(".risk-architecture .status-red")).toBeVisible();
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

    for (const route of ["home", "services", "library", "guidance", "risk", "about"]) {
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
