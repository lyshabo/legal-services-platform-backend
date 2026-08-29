CREATE TYPE "AssessmentStatus" AS ENUM ('MISSING_INFORMATION','UNSUPPORTED_JURISDICTION','ATTORNEY_REVIEW_REQUIRED','ESCALATED','ATTORNEY_APPROVED','REJECTED');
CREATE TABLE "PreliminaryAssessment" (
  "id" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "jurisdiction" TEXT NOT NULL,
  "issue" TEXT NOT NULL,
  "urgency" BOOLEAN NOT NULL DEFAULT false,
  "status" "AssessmentStatus" NOT NULL DEFAULT 'ATTORNEY_REVIEW_REQUIRED',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewedById" TEXT,
  "reviewNote" TEXT,
  CONSTRAINT "PreliminaryAssessment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PreliminaryAssessment_status_submittedAt_idx" ON "PreliminaryAssessment"("status","submittedAt");
CREATE INDEX "PreliminaryAssessment_reviewedById_reviewedAt_idx" ON "PreliminaryAssessment"("reviewedById","reviewedAt");
ALTER TABLE "PreliminaryAssessment" ADD CONSTRAINT "PreliminaryAssessment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditEvent" ADD COLUMN "assessmentId" TEXT;
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "PreliminaryAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
