import { test, expect } from "@playwright/test";

const locales = ["en", "fr", "zh", "zh-Hant"];
const demoScopeTitles = {
  en: "What this temporary demo includes",
  fr: "Contenu de cette d\u00e9monstration temporaire",
  zh: "\u6b64\u4e34\u65f6\u6f14\u793a\u5305\u542b\u7684\u5185\u5bb9",
  "zh-Hant": "\u6b64\u81e8\u6642\u793a\u7bc4\u5305\u542b\u7684\u5167\u5bb9"
};

test("static About route preserves locale, resolved Bar status, and noindex", async ({ page }) => {
  for (const locale of locales) {
    await page.goto("/#/about");
    await page.selectOption("#locale-select", locale);
    await expect(page.locator("h1").first()).toHaveText("Tezzeta Mbuya N'Gungwa");
    await expect(page.locator(".bar-status-panel .badge")).toBeVisible();
    await expect(page.locator(".bar-status-panel")).toContainText("Mbuya");
    await expect(page.locator(".experience-list article")).toHaveCount(4);
    await expect(page.locator(".credential-timeline article")).toHaveCount(4);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow, noarchive"
    );
    expect(await page.locator("html").getAttribute("lang")).toBeTruthy();
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
  await expect(page.locator("#product-results .catalog-card")).toHaveCount(8);
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
