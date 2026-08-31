import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e-static",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4174",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"]
  },
  webServer: {
    command: "python -m http.server 4174 --directory static-demo",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 20_000
  }
});
