import test from "node:test";
import assert from "node:assert/strict";
import {
  addAssessmentEvidence,
  addRiskFinding,
  createInvestmentAssessment,
  getInvestmentAssessment,
  listProfessionalReviews,
  queueProfessionalReview,
  resetInvestmentAssessmentMemory,
  reviewProfessionalAssessment
} from "../investment-assessment-repository.mjs";
import { analyzeInvestmentAssessment, claudeConfiguration } from "../claude-adapter.mjs";
import { hasPermission } from "../auth.config.mjs";

test("investment assessment memory workflow persists evidence, finding, and professional review", async () => {
  resetInvestmentAssessmentMemory();
  const assessment = await createInvestmentAssessment(
    { projectName: "DRC development fixture", sector: "Mining" },
    "customer-1"
  );
  assert.equal(assessment.status, "SUBMITTED");
  const evidence = await addAssessmentEvidence(assessment.id, {
    claim: "A source requires review",
    source: "Development source register",
    verificationStatus: "REPORTED"
  });
  const finding = await addRiskFinding(assessment.id, {
    category: "LEGAL_REGULATORY",
    description: "Regulatory evidence gap",
    evidenceId: evidence.id,
    mitigation: "Obtain qualified local review"
  });
  assert.equal(finding.evidenceId, evidence.id);
  const review = await queueProfessionalReview(assessment.id, "DRC_COUNSEL");
  assert.equal((await getInvestmentAssessment(assessment.id)).status, "IN_REVIEW");
  assert.equal((await listProfessionalReviews()).length, 1);
  const approved = await reviewProfessionalAssessment(
    review.id,
    "reviewer-1",
    "APPROVED",
    "Approved for professional review only"
  );
  assert.equal(approved.status, "APPROVED");
  const completed = await getInvestmentAssessment(assessment.id);
  assert.equal(completed.status, "APPROVED");
  assert.equal(completed.findings.length, 1);
});

test("investment risk permissions and Claude adapter fail closed", async () => {
  assert.equal(hasPermission("CUSTOMER", "investment.create"), true);
  assert.equal(hasPermission("PUBLIC_USER", "investment.create"), false);
  assert.equal(hasPermission("AI_REVIEWER", "investment.review"), true);
  assert.equal(claudeConfiguration({}).enabled, false);
  assert.equal(
    claudeConfiguration({
      ALLOW_CLAUDE_ANALYSIS: "true",
      CLAUDE_API_KEY: "development-placeholder"
    }).enabled,
    false
  );
  const result = await analyzeInvestmentAssessment({ projectName: "fixture" }, {});
  assert.equal(result.status, "BLOCKED");
});
