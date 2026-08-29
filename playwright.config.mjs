import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 20_000,
    env: {
      ...process.env,
      APP_ENV: "development",
      AUTH_ADAPTER: "dev",
      PAYMENT_PROVIDER: "development"
    }
  }
});
