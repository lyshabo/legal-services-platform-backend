import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

test("investment assessment HTTP lifecycle enforces authentication and professional review", async (context) => {
  const previous = {
    APP_ENV: process.env.APP_ENV,
    AUTH_ADAPTER: process.env.AUTH_ADAPTER,
    DEV_ADMIN_KEY: process.env.DEV_ADMIN_KEY
  };
  process.env.APP_ENV = "development";
  process.env.AUTH_ADAPTER = "dev";
  process.env.DEV_ADMIN_KEY = "development-test-key-32-characters";

  const { handleRequest } = await import(`../server.mjs?investment-api=${Date.now()}`);
  const server = createServer(handleRequest);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  context.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  const origin = `http://127.0.0.1:${server.address().port}`;
  const denied = await fetch(`${origin}/api/investment-assessments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectName: "Denied fixture" })
  });
  assert.equal(denied.status, 403);

  const login = await fetch(`${origin}/api/auth/dev-login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ key: process.env.DEV_ADMIN_KEY })
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.getSetCookie()[0].split(";")[0];

  const createdResponse = await fetch(`${origin}/api/investment-assessments`, {
    method: "POST",
    headers: { cookie, "content-type": "application/json" },
    body: JSON.stringify({
      projectName: "Authenticated DRC fixture",
      sector: "Infrastructure",
      diligenceScope: ["legal", "counterparty"]
    })
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json();
  assert.equal(created.status, "SUBMITTED");
  assert.equal(created.userId, "dev-admin");

  const evidenceResponse = await fetch(
    `${origin}/api/investment-assessments/${created.id}/evidence`,
    {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({
        claim: "Licence evidence requires professional validation",
        source: "Authenticated development fixture"
      })
    }
  );
  assert.equal(evidenceResponse.status, 201);

  const findingResponse = await fetch(
    `${origin}/api/investment-assessments/${created.id}/findings`,
    {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({
        category: "LEGAL_REGULATORY",
        description: "Evidence remains unverified"
      })
    }
  );
  assert.equal(findingResponse.status, 201);

  const analysisResponse = await fetch(
    `${origin}/api/investment-assessments/${created.id}/analyze`,
    { method: "POST", headers: { cookie } }
  );
  assert.equal(analysisResponse.status, 200);
  const analysis = await analysisResponse.json();
  assert.equal(analysis.result.status, "BLOCKED");
  assert.equal(analysis.review.status, "PENDING");

  const assessmentResponse = await fetch(
    `${origin}/api/investment-assessments/${created.id}`,
    { headers: { cookie } }
  );
  assert.equal(assessmentResponse.status, 200);
  const assessment = await assessmentResponse.json();
  assert.equal(assessment.status, "IN_REVIEW");
  assert.equal(assessment.evidence.length, 1);
  assert.equal(assessment.findings.length, 1);
  assert.equal(assessment.reviews.length, 1);

  const reviewResponse = await fetch(`${origin}/api/admin/investment-reviews`);
  assert.equal(reviewResponse.status, 403);
});
