import { defineConfig, devices } from "@playwright/test";
import { randomBytes } from "node:crypto";

process.env.E2E_DEV_ADMIN_KEY ||= randomBytes(32).toString("hex");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 20_000,
    env: {
      ...process.env,
      APP_ENV: "development",
      AUTH_ADAPTER: "dev",
      DEV_ADMIN_KEY: process.env.E2E_DEV_ADMIN_KEY,
      PAYMENT_PROVIDER: "development"
    }
  }
});
