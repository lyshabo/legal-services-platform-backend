import { randomUUID } from "node:crypto";
import { appendAudit } from "./server-repository.mjs";
import { getPrisma, prismaEnabled } from "./prisma-client.mjs";

const questionnaires = new Map([
  [
    "questionnaire-orientation",
    {
      id: "questionnaire-orientation",
      serviceId: "service-orientation",
      currentVersion: 1,
      versions: [
        {
          version: 1,
          status: "published",
          questions: [
            {
              key: "matterType",
              type: "select",
              required: true,
              order: 1,
              translations: {
                en: "What type of matter are you exploring?",
                fr: "Quel type de question explorez-vous ?",
                zh: "您正在了解哪类事项？"
              },
              options: ["orientation"]
            },
            {
              key: "jurisdiction",
              type: "text",
              required: true,
              order: 2,
              translations: {
                en: "Country or jurisdiction",
                fr: "Pays ou juridiction",
                zh: "国家或司法管辖区"
              }
            }
          ]
        }
      ]
    }
  ]
]);

const questionnaireInclude = {
  versions: {
    orderBy: { version: "asc" },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { translations: true, rules: true }
      }
    }
  }
};

function normalizeQuestionnaire(questionnaire) {
  if (!questionnaire) return null;
  return {
    id: questionnaire.id,
    serviceId: questionnaire.serviceId,
    topic: questionnaire.topic,
    currentVersion: questionnaire.currentVersion,
    versions: questionnaire.versions.map((version) => ({
      id: version.id,
      version: version.version,
      status: version.status.toLowerCase(),
      createdAt: version.createdAt?.toISOString?.() ?? version.createdAt,
      questions: version.questions.map((question) => ({
        key: question.key,
        type: question.type,
        required: question.required,
        order: question.order,
        translations: Object.fromEntries(
          question.translations.map((translation) => [translation.locale, translation.label])
        ),
        rules: question.rules ?? []
      }))
    }))
  };
}

export async function getQuestionnaire(id = "questionnaire-orientation") {
  if (!prismaEnabled()) return questionnaires.get(id) ?? null;
  const prisma = await getPrisma();
  return normalizeQuestionnaire(
    await prisma.questionnaire.findUnique({ where: { id }, include: questionnaireInclude })
  );
}

export async function createQuestionnaireVersion(id, payload, actor) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.$transaction(
      async (tx) => {
        const [locked] = await tx.$queryRaw`
          SELECT id, "currentVersion" FROM "Questionnaire" WHERE id = ${id} FOR UPDATE
        `;
        if (!locked) return null;
        const nextVersion = locked.currentVersion + 1;
        const status = payload.status === "published" ? "PUBLISHED" : "DRAFT";
        const version = await tx.questionnaireVersion.create({
          data: {
            questionnaireId: id,
            version: nextVersion,
            status,
            questions: {
              create: (payload.questions ?? []).map((question, index) => ({
                key: question.key,
                type: question.type ?? "text",
                required: Boolean(question.required),
                order: question.order ?? index + 1,
                translations: {
                  create: Object.entries(question.translations ?? {}).map(([locale, label]) => ({
                    locale,
                    label: typeof label === "string" ? label : label.label ?? ""
                  }))
                }
              }))
            }
          },
          include: questionnaireInclude.versions.include
        });
        await tx.questionnaire.update({
          where: { id },
          data: { currentVersion: nextVersion }
        });
        await tx.auditEvent.create({
          data: {
            action: "questionnaire.version.created",
            actorId: actor.id,
            actorRole: actor.role.toUpperCase(),
            targetType: "Questionnaire",
            targetId: id,
            metadata: { version: nextVersion, status }
          }
        });
        const questionnaire = await tx.questionnaire.findUnique({
          where: { id },
          include: questionnaireInclude
        });
        return {
          ...normalizeQuestionnaire(questionnaire),
          createdVersion: normalizeQuestionnaire({
            id,
            serviceId: questionnaire.serviceId,
            topic: questionnaire.topic,
            currentVersion: nextVersion,
            versions: [version]
          }).versions[0]
        };
      },
      { isolationLevel: "Serializable" }
    );
  }

  const questionnaire = questionnaires.get(id);
  if (!questionnaire) return null;
  const version = {
    version: questionnaire.currentVersion + 1,
    status: payload.status === "published" ? "published" : "draft",
    createdAt: new Date().toISOString(),
    createdBy: actor.id,
    questions: payload.questions ?? []
  };
  questionnaire.currentVersion = version.version;
  questionnaire.versions.push(version);
  await appendAudit({
    id: randomUUID(),
    action: "questionnaire.version.created",
    actorId: actor.id,
    actorRole: actor.role,
    targetType: "Questionnaire",
    targetId: id,
    metadata: { version: version.version, status: version.status },
    at: version.createdAt
  });
  return { ...questionnaire, createdVersion: version };
}

export function evaluateSubmission(questionnaire, answers) {
  const active = [...questionnaire.versions].reverse().find((version) => version.status === "published");
  if (!active) return { ok: false, error: "No published questionnaire version" };
  const missing = active.questions
    .filter((question) => question.required && !String(answers[question.key] ?? "").trim())
    .map((question) => question.key);
  return missing.length ? { ok: false, missing } : { ok: true, version: active.version };
}

export async function submitQuestionnaire(id, { answers = {}, locale = "en", userId = null }) {
  const questionnaire = await getQuestionnaire(id);
  if (!questionnaire) return { error: "QUESTIONNAIRE_NOT_FOUND", statusCode: 404 };
  const evaluation = evaluateSubmission(questionnaire, answers);
  if (!evaluation.ok) return { ...evaluation, statusCode: 400 };
  if (!prismaEnabled()) {
    return {
      id: `submission-${Date.now()}`,
      status: "received",
      questionnaireVersion: evaluation.version,
      locale
    };
  }
  const prisma = await getPrisma();
  const active = await prisma.questionnaireVersion.findUnique({
    where: { questionnaireId_version: { questionnaireId: id, version: evaluation.version } }
  });
  const submission = await prisma.questionnaireSubmission.create({
    data: {
      questionnaireId: id,
      questionnaireVersionId: active.id,
      userId,
      locale,
      answers: {
        create: Object.entries(answers).map(([questionKey, value]) => ({ questionKey, value }))
      }
    }
  });
  await appendAudit({
    action: "questionnaire.submitted",
    targetType: "QuestionnaireSubmission",
    targetId: submission.id,
    metadata: { questionnaireId: id, version: evaluation.version, locale }
  });
  return {
    id: submission.id,
    status: submission.status.toLowerCase(),
    questionnaireVersion: evaluation.version,
    locale
  };
}
