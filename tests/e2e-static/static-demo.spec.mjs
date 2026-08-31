import { test, expect } from "@playwright/test";

const locales = ["en", "fr", "zh", "zh-Hant"];

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
