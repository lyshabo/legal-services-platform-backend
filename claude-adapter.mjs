const DEFAULT_ENDPOINT = "https://api.anthropic.com/v1/messages";

export function claudeConfiguration(env = process.env) {
  const requirements = {
    apiKey: Boolean(env.CLAUDE_API_KEY),
    analysisApproved: env.ALLOW_CLAUDE_ANALYSIS === "true",
    retentionApproved: env.CLAUDE_RETENTION_APPROVED === "true",
    sourcePolicyApproved: env.CLAUDE_SOURCE_POLICY_APPROVED === "true",
    professionalReviewRequired: env.CLAUDE_PROFESSIONAL_REVIEW_REQUIRED === "true"
  };
  return {
    enabled: Object.values(requirements).every(Boolean),
    endpoint: env.CLAUDE_API_URL || DEFAULT_ENDPOINT,
    model: env.CLAUDE_MODEL || "claude-3-5-sonnet-latest",
    missing: Object.entries(requirements)
      .filter(([, present]) => !present)
      .map(([name]) => name)
  };
}

export async function analyzeInvestmentAssessment(assessment, env = process.env) {
  const config = claudeConfiguration(env);
  if (!config.enabled) {
    return {
      status: "BLOCKED",
      reason:
        "Claude analysis is unavailable until an approved server-side API key, endpoint, model, retention policy, and professional-review gate are configured."
    };
  }
  const evidence = Array.isArray(assessment.evidence) ? assessment.evidence : [];
  const providerInput = {
    assessmentId: assessment.id,
    projectName: assessment.projectName,
    company: assessment.company,
    sector: assessment.sector,
    province: assessment.province,
    city: assessment.city,
    investmentAmount: assessment.investmentAmount,
    investmentStructure: assessment.investmentStructure,
    projectStage: assessment.projectStage,
    diligenceScope: assessment.diligenceScope,
    evidence: evidence.map((item) => ({
      id: item.id,
      claim: item.claim,
      source: item.source,
      url: item.url,
      sourceType: item.sourceType,
      publicationDate: item.publicationDate,
      eventDate: item.eventDate,
      jurisdiction: item.jurisdiction,
      excerpt: item.excerpt,
      reliabilityLimits: item.reliabilityLimits,
      riskCategory: item.riskCategory,
      verificationStatus: item.verificationStatus
    }))
  };
  const prompt = [
    "You are an evidence-constrained investment risk analysis adapter.",
    "Do not invent facts, citations, scores, sanctions results, or government records.",
    "Separate claim, evidence, source, analysis, and uncertainty.",
    "Return structured JSON only.",
    JSON.stringify({ assessment: providerInput })
  ].join("\n");
  let response;
  try {
    response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 2000,
        temperature: 0,
        messages: [{ role: "user", content: prompt }]
      })
    });
  } catch {
    return { status: "ERROR", reason: "Claude provider request failed" };
  }
  if (!response.ok) {
    return { status: "ERROR", reason: `Claude provider returned HTTP ${response.status}` };
  }
  const payload = await response.json();
  return {
    status: "DRAFT",
    provider: "claude",
    model: config.model,
    output: payload
  };
}
