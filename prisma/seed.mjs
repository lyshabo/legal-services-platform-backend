import { PrismaClient } from "@prisma/client";
import { services } from "../data.js";

const appEnv = process.env.APP_ENV || "development";
const seedMode = process.env.SEED_MODE || (appEnv === "development" ? "development" : "");
const developmentSeed = appEnv === "development" && seedMode === "development";
const previewSeed = appEnv === "production" && seedMode === "preview-fixture";

if (!developmentSeed && !previewSeed) {
  console.error(
    "Seed refused: use development/development locally or production/preview-fixture for the approved preview environment."
  );
  process.exitCode = 2;
  process.exit();
}

const seedActorId = developmentSeed ? "dev-admin" : null;
const serviceVersionStatus = developmentSeed ? "PUBLISHED" : "IN_REVIEW";
const prisma = new PrismaClient();

const questionnaireQuestions = [
  {
    key: "matterType",
    type: "select",
    required: true,
    order: 1,
    translations: {
      en: "What type of matter are you exploring?",
      fr: "Quel type de question explorez-vous ?",
      zh: "您正在了解哪类事项？"
    }
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
];

await prisma.$transaction(async (tx) => {
  if (previewSeed) {
    const developmentAdmin = await tx.user.findFirst({
      where: {
        OR: [{ id: "dev-admin" }, { email: "dev-admin@localhost" }]
      },
      select: { id: true }
    });
    if (developmentAdmin) {
      throw new Error(
        "Preview seed refused because a development administrator exists in the target database."
      );
    }
  }

  if (developmentSeed) {
    await tx.user.upsert({
      where: { email: "dev-admin@localhost" },
      update: { role: "PLATFORM_ADMIN", name: "Development administrator" },
      create: {
        id: "dev-admin",
        email: "dev-admin@localhost",
        role: "PLATFORM_ADMIN",
        name: "Development administrator"
      }
    });
  }

  for (const service of services) {
    await tx.service.upsert({
      where: { id: service.id },
      update: {
        category: service.category,
        fixture: service.fixture,
        bookingEnabled: service.bookingEnabled
      },
      create: {
        id: service.id,
        category: service.category,
        fixture: service.fixture,
        bookingEnabled: service.bookingEnabled,
        currentVersion: 1
      }
    });

    const version = await tx.serviceVersion.upsert({
      where: { serviceId_version: { serviceId: service.id, version: 1 } },
      update: { status: serviceVersionStatus, createdById: seedActorId },
      create: {
        serviceId: service.id,
        version: 1,
        status: serviceVersionStatus,
        createdById: seedActorId
      }
    });

    for (const [locale, translation] of Object.entries(service.translations)) {
      await tx.serviceTranslation.upsert({
        where: { serviceVersionId_locale: { serviceVersionId: version.id, locale } },
        update: translation,
        create: { serviceVersionId: version.id, locale, ...translation }
      });
    }
  }

  const questionnaire = await tx.questionnaire.upsert({
    where: { id: "questionnaire-orientation" },
    update: { serviceId: "service-orientation", topic: "orientation" },
    create: {
      id: "questionnaire-orientation",
      serviceId: "service-orientation",
      topic: "orientation",
      currentVersion: 1
    }
  });

  const questionnaireVersion = await tx.questionnaireVersion.upsert({
    where: {
      questionnaireId_version: {
        questionnaireId: questionnaire.id,
        version: 1
      }
    },
    update: { status: "PUBLISHED" },
    create: {
      questionnaireId: questionnaire.id,
      version: 1,
      status: "PUBLISHED"
    }
  });

  for (const question of questionnaireQuestions) {
    const storedQuestion = await tx.questionnaireQuestion.upsert({
      where: {
        questionnaireVersionId_key: {
          questionnaireVersionId: questionnaireVersion.id,
          key: question.key
        }
      },
      update: {
        type: question.type,
        required: question.required,
        order: question.order
      },
      create: {
        questionnaireVersionId: questionnaireVersion.id,
        key: question.key,
        type: question.type,
        required: question.required,
        order: question.order
      }
    });
    for (const [locale, label] of Object.entries(question.translations)) {
      await tx.questionnaireQuestionTranslation.upsert({
        where: { questionId_locale: { questionId: storedQuestion.id, locale } },
        update: { label },
        create: { questionId: storedQuestion.id, locale, label }
      });
    }
  }

  const rule = await tx.availabilityRule.findFirst({
    where: {
      serviceId: "service-orientation",
      timezone: "America/New_York",
      weekday: 2,
      startMinute: 540,
      endMinute: 1020
    }
  });
  if (!rule) {
    await tx.availabilityRule.create({
      data: {
        serviceId: "service-orientation",
        timezone: "America/New_York",
        weekday: 2,
        startMinute: 540,
        endMinute: 1020,
        active: true
      }
    });
  }

  const base = new Date("2026-09-01T13:00:00.000Z");
  for (let index = 0; index < 6; index += 1) {
    const startsAt = new Date(base.getTime() + index * 60 * 60 * 1000);
    await tx.bookingSlot.upsert({
      where: {
        serviceId_startsAt: {
          serviceId: "service-orientation",
          startsAt
        }
      },
      update: {},
      create: {
        id: `slot-${index + 1}`,
        serviceId: "service-orientation",
        startsAt,
        endsAt: new Date(startsAt.getTime() + 30 * 60 * 1000),
        timezone: "UTC",
        status: "AVAILABLE"
      }
    });
  }

  await tx.auditEvent.create({
    data: {
      action: "database.seed.completed",
      actorId: seedActorId,
      actorRole: developmentSeed ? "PLATFORM_ADMIN" : null,
      targetType: "Database",
      targetId: developmentSeed ? "development" : "preview-fixture",
      metadata: { seededAt: new Date().toISOString(), seedMode }
    }
  });
});

await prisma.$disconnect();
