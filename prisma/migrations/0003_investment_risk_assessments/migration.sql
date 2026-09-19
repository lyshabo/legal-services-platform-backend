CREATE TYPE "InvestmentAssessmentStatus" AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'IN_REVIEW',
  'ANALYSIS_BLOCKED',
  'APPROVED',
  'REJECTED'
);

CREATE TYPE "EvidenceVerificationStatus" AS ENUM (
  'CONFIRMED',
  'DOCUMENTED',
  'REPORTED',
  'ALLEGED',
  'DISPUTED',
  'NOT_INDEPENDENTLY_VERIFIED'
);

CREATE TYPE "ProfessionalReviewStatus" AS ENUM (
  'PENDING',
  'IN_PROGRESS',
  'APPROVED',
  'REJECTED'
);

CREATE TABLE "InvestmentAssessment" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "projectName" TEXT NOT NULL,
  "company" TEXT,
  "sector" TEXT,
  "province" TEXT,
  "city" TEXT,
  "investmentAmount" TEXT,
  "investmentStructure" TEXT,
  "projectStage" TEXT,
  "localPartners" TEXT,
  "governmentCounterparties" TEXT,
  "ownershipInformation" TEXT,
  "beneficialOwners" TEXT,
  "expectedInvestmentPeriod" TEXT,
  "financingStructure" TEXT,
  "contracts" TEXT,
  "licences" TEXT,
  "permits" TEXT,
  "concessions" TEXT,
  "diligenceScope" JSONB,
  "status" "InvestmentAssessmentStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InvestmentAssessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentEvidence" (
  "id" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "claim" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "url" TEXT,
  "sourceType" TEXT,
  "publicationDate" TEXT,
  "eventDate" TEXT,
  "jurisdiction" TEXT,
  "excerpt" TEXT,
  "reliabilityLimits" TEXT,
  "riskCategory" TEXT,
  "verificationStatus" "EvidenceVerificationStatus" NOT NULL DEFAULT 'NOT_INDEPENDENTLY_VERIFIED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AssessmentEvidence_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RiskFinding" (
  "id" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "evidenceId" TEXT,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "likelihood" TEXT,
  "potentialImpact" TEXT,
  "existingControls" TEXT,
  "controlEffectiveness" TEXT,
  "mitigation" TEXT,
  "residualRisk" TEXT,
  "monitoringIndicators" TEXT,
  "reviewDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RiskFinding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalReview" (
  "id" TEXT NOT NULL,
  "assessmentId" TEXT NOT NULL,
  "reviewType" TEXT NOT NULL,
  "status" "ProfessionalReviewStatus" NOT NULL DEFAULT 'PENDING',
  "reviewerId" TEXT,
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "ProfessionalReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "InvestmentAssessment_userId_status_idx" ON "InvestmentAssessment"("userId", "status");
CREATE INDEX "InvestmentAssessment_status_updatedAt_idx" ON "InvestmentAssessment"("status", "updatedAt");
CREATE INDEX "AssessmentEvidence_assessmentId_verificationStatus_idx" ON "AssessmentEvidence"("assessmentId", "verificationStatus");
CREATE INDEX "RiskFinding_assessmentId_category_idx" ON "RiskFinding"("assessmentId", "category");
CREATE INDEX "ProfessionalReview_status_createdAt_idx" ON "ProfessionalReview"("status", "createdAt");
CREATE INDEX "ProfessionalReview_assessmentId_reviewType_idx" ON "ProfessionalReview"("assessmentId", "reviewType");

ALTER TABLE "AssessmentEvidence"
  ADD CONSTRAINT "AssessmentEvidence_assessmentId_fkey"
  FOREIGN KEY ("assessmentId") REFERENCES "InvestmentAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RiskFinding"
  ADD CONSTRAINT "RiskFinding_assessmentId_fkey"
  FOREIGN KEY ("assessmentId") REFERENCES "InvestmentAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RiskFinding"
  ADD CONSTRAINT "RiskFinding_evidenceId_fkey"
  FOREIGN KEY ("evidenceId") REFERENCES "AssessmentEvidence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProfessionalReview"
  ADD CONSTRAINT "ProfessionalReview_assessmentId_fkey"
  FOREIGN KEY ("assessmentId") REFERENCES "InvestmentAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InvestmentAssessment"
  ADD CONSTRAINT "InvestmentAssessment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProfessionalReview"
  ADD CONSTRAINT "ProfessionalReview_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
