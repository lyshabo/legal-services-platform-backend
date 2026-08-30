import { randomUUID } from "node:crypto";
import { getPrisma, prismaEnabled } from "./prisma-client.mjs";
import { appendAudit } from "./server-repository.mjs";

const memory = [];

const normalizeStatus = (value, urgent = false) => {
  if (value === "UNSUPPORTED_JURISDICTION") return "UNSUPPORTED_JURISDICTION";
  if (value === "ATTORNEY_APPROVED_RESPONSE") return "ATTORNEY_APPROVED";
  if (urgent) return "ESCALATED";
  return "ATTORNEY_REVIEW_REQUIRED";
};

export async function createAssessment(input = {}) {
  const language = String(input.language || "").trim();
  const jurisdiction = String(input.jurisdiction || "").trim();
  const issue = String(input.issue || "").trim();
  const urgency = Boolean(input.urgent);
  const status = !language || !jurisdiction || !issue
    ? "MISSING_INFORMATION"
    : normalizeStatus(input.status, urgency);
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.preliminaryAssessment.create({
        data: { language, jurisdiction, issue, urgency, status }
      });
      await tx.auditEvent.create({
        data: {
          action: "assessment.created",
          targetType: "PreliminaryAssessment",
          targetId: assessment.id,
          assessmentId: assessment.id,
          metadata: { status }
        }
      });
      return assessment;
    });
  }
  const assessment = { id: `assessment-${randomUUID()}`, language, jurisdiction, issue, urgency, status, submittedAt: new Date().toISOString() };
  memory.unshift(assessment);
  await appendAudit({ action: "assessment.created", targetType: "PreliminaryAssessment", targetId: assessment.id, metadata: { status } });
  return assessment;
}

export async function listAssessments(filters = {}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.preliminaryAssessment.findMany({ where: filters.status ? { status: filters.status } : undefined, orderBy: { submittedAt: "desc" }, take: 100 });
  }
  return memory.filter((item) => !filters.status || item.status === filters.status);
}

export async function reviewAssessment(id, actor, status, reviewNote = "") {
  const allowed = ["ATTORNEY_REVIEW_REQUIRED", "ESCALATED", "ATTORNEY_APPROVED", "REJECTED"];
  if (!allowed.includes(status)) return null;
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.preliminaryAssessment.findUnique({ where: { id } });
      if (!assessment) return null;
      const updated = await tx.preliminaryAssessment.update({ where: { id }, data: { status, reviewedAt: new Date(), reviewedById: actor.id, reviewNote } });
      await tx.auditEvent.create({ data: { action: "assessment.reviewed", actorId: actor.id, actorRole: actor.role.toUpperCase(), targetType: "PreliminaryAssessment", targetId: id, assessmentId: id, metadata: { from: assessment.status, to: status } } });
      return updated;
    });
  }
  const assessment = memory.find((item) => item.id === id);
  if (!assessment) return null;
  assessment.status = status;
  assessment.reviewedAt = new Date().toISOString();
  assessment.reviewedById = actor.id;
  assessment.reviewNote = reviewNote;
  await appendAudit({ action: "assessment.reviewed", actorId: actor.id, actorRole: actor.role, targetType: "PreliminaryAssessment", targetId: id, metadata: { status } });
  return assessment;
}
