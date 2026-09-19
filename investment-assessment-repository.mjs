import { randomUUID } from "node:crypto";
import { getPrisma, prismaEnabled } from "./prisma-client.mjs";

const memory = {
  assessments: [],
  evidence: [],
  findings: [],
  reviews: []
};

const investmentFields = [
  "projectName",
  "company",
  "sector",
  "province",
  "city",
  "investmentAmount",
  "investmentStructure",
  "projectStage",
  "localPartners",
  "governmentCounterparties",
  "ownershipInformation",
  "beneficialOwners",
  "expectedInvestmentPeriod",
  "financingStructure",
  "contracts",
  "licences",
  "permits",
  "concessions",
  "diligenceScope"
];

function assessmentData(input = {}) {
  return Object.fromEntries(
    investmentFields
      .filter((field) => input[field] !== undefined)
      .map((field) => [field, field === "diligenceScope" ? input[field] : String(input[field] ?? "").trim()])
  );
}

function normalizeReview(review) {
  return {
    ...review,
    status: String(review.status || "PENDING").toUpperCase()
  };
}

export async function createInvestmentAssessment(input = {}, userId = null) {
  const data = assessmentData(input);
  if (!data.projectName) throw new Error("projectName is required");
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.investmentAssessment.create({
      data: { ...data, userId, status: "SUBMITTED" }
    });
  }
  const assessment = {
    id: `investment-${randomUUID()}`,
    ...data,
    userId,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memory.assessments.unshift(assessment);
  return assessment;
}

export async function getInvestmentAssessment(id) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.investmentAssessment.findUnique({
      where: { id },
      include: { evidence: true, findings: true, reviews: true }
    });
  }
  const assessment = memory.assessments.find((item) => item.id === id);
  if (!assessment) return null;
  return {
    ...assessment,
    evidence: memory.evidence.filter((item) => item.assessmentId === id),
    findings: memory.findings.filter((item) => item.assessmentId === id),
    reviews: memory.reviews.filter((item) => item.assessmentId === id)
  };
}

export async function listInvestmentAssessments({ userId, status } = {}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.investmentAssessment.findMany({
      where: { ...(userId ? { userId } : {}), ...(status ? { status } : {}) },
      orderBy: { updatedAt: "desc" },
      take: 100
    });
  }
  return memory.assessments.filter(
    (item) => (!userId || item.userId === userId) && (!status || item.status === status)
  );
}

export async function addAssessmentEvidence(assessmentId, input = {}) {
  if (!input.claim || !input.source) throw new Error("claim and source are required");
  const data = {
    assessmentId,
    claim: String(input.claim).trim(),
    source: String(input.source).trim(),
    url: input.url ? String(input.url).trim() : null,
    sourceType: input.sourceType ? String(input.sourceType).trim() : null,
    publicationDate: input.publicationDate ? String(input.publicationDate).trim() : null,
    eventDate: input.eventDate ? String(input.eventDate).trim() : null,
    jurisdiction: input.jurisdiction ? String(input.jurisdiction).trim() : null,
    excerpt: input.excerpt ? String(input.excerpt).trim() : null,
    reliabilityLimits: input.reliabilityLimits ? String(input.reliabilityLimits).trim() : null,
    riskCategory: input.riskCategory ? String(input.riskCategory).trim() : null,
    verificationStatus: String(input.verificationStatus || "NOT_INDEPENDENTLY_VERIFIED").toUpperCase()
  };
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.assessmentEvidence.create({ data });
  }
  const evidence = { id: `evidence-${randomUUID()}`, ...data, createdAt: new Date().toISOString() };
  memory.evidence.unshift(evidence);
  return evidence;
}

export async function addRiskFinding(assessmentId, input = {}) {
  if (!input.category || !input.description) throw new Error("category and description are required");
  const data = {
    assessmentId,
    evidenceId: input.evidenceId || null,
    category: String(input.category).trim(),
    description: String(input.description).trim(),
    likelihood: input.likelihood || null,
    potentialImpact: input.potentialImpact || null,
    existingControls: input.existingControls || null,
    controlEffectiveness: input.controlEffectiveness || null,
    mitigation: input.mitigation || null,
    residualRisk: input.residualRisk || null,
    monitoringIndicators: input.monitoringIndicators || null,
    reviewDate: input.reviewDate ? new Date(input.reviewDate) : null
  };
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.riskFinding.create({ data });
  }
  const finding = { id: `finding-${randomUUID()}`, ...data, createdAt: new Date().toISOString() };
  memory.findings.unshift(finding);
  return finding;
}

export async function queueProfessionalReview(assessmentId, reviewType = "LEGAL_REVIEW") {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.$transaction(async (tx) => {
      const review = await tx.professionalReview.create({ data: { assessmentId, reviewType } });
      await tx.investmentAssessment.update({
        where: { id: assessmentId },
        data: { status: "IN_REVIEW" }
      });
      return review;
    });
  }
  const assessment = memory.assessments.find((item) => item.id === assessmentId);
  if (!assessment) return null;
  const review = {
    id: `review-${randomUUID()}`,
    assessmentId,
    reviewType,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
  assessment.status = "IN_REVIEW";
  assessment.updatedAt = new Date().toISOString();
  memory.reviews.unshift(review);
  return review;
}

export async function listProfessionalReviews({ status } = {}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.professionalReview.findMany({
      where: status ? { status } : undefined,
      include: { assessment: true },
      orderBy: { createdAt: "asc" },
      take: 100
    });
  }
  return memory.reviews.filter((item) => !status || item.status === status);
}

export async function reviewProfessionalAssessment(id, reviewerId, status, reviewNote = "") {
  const normalized = normalizeReview({ status });
  if (!["IN_PROGRESS", "APPROVED", "REJECTED"].includes(normalized.status)) return null;
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.$transaction(async (tx) => {
      const review = await tx.professionalReview.findUnique({ where: { id } });
      if (!review) return null;
      const updated = await tx.professionalReview.update({
        where: { id },
        data: {
          status: normalized.status,
          reviewerId,
          reviewNote,
          reviewedAt: new Date()
        },
        include: { assessment: true }
      });
      if (["APPROVED", "REJECTED"].includes(normalized.status)) {
        await tx.investmentAssessment.update({
          where: { id: review.assessmentId },
          data: { status: normalized.status }
        });
      }
      return tx.professionalReview.findUnique({
        where: { id: updated.id },
        include: { assessment: true }
      });
    });
  }
  const review = memory.reviews.find((item) => item.id === id);
  if (!review) return null;
  Object.assign(review, {
    status: normalized.status,
    reviewerId,
    reviewNote,
    reviewedAt: new Date().toISOString()
  });
  const assessment = memory.assessments.find((item) => item.id === review.assessmentId);
  if (assessment && ["APPROVED", "REJECTED"].includes(normalized.status)) {
    assessment.status = normalized.status;
    assessment.updatedAt = new Date().toISOString();
  }
  return review;
}

export function resetInvestmentAssessmentMemory() {
  memory.assessments.length = 0;
  memory.evidence.length = 0;
  memory.findings.length = 0;
  memory.reviews.length = 0;
}
