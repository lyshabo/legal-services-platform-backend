import test from "node:test";
import assert from "node:assert/strict";

const databaseEnabled =
  process.env.PERSISTENCE_ADAPTER === "prisma" && Boolean(process.env.DATABASE_URL);

test(
  "Prisma repositories preserve questionnaire, availability, booking, and payment contracts",
  { skip: databaseEnabled ? false : "Set PERSISTENCE_ADAPTER=prisma and DATABASE_URL to run live contracts" },
  async (context) => {
    const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const serviceId = `contract-service-${suffix}`;
    const slotId = `contract-slot-${suffix}`;
    const bookingKey = `contract-booking-${suffix}`;
    const paymentKey = `contract-payment-${suffix}`;
    let submissionId;
    const actor = { id: "dev-admin", role: "platform_admin" };
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const bookingRepository = await import("../booking-repository.mjs");
    const questionnaireRepository = await import("../questionnaire-repository.mjs");

    context.after(async () => {
      const bookings = await prisma.booking.findMany({
        where: { slotId },
        select: { id: true, paymentId: true }
      });
      const bookingIds = bookings.map((booking) => booking.id);
      const paymentIds = bookings.map((booking) => booking.paymentId).filter(Boolean);
      await prisma.bookingStatusHistory.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await prisma.booking.updateMany({
        where: { id: { in: bookingIds } },
        data: { paymentId: null }
      });
      await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
      await prisma.paymentAttempt.deleteMany({
        where: { OR: [{ id: { in: paymentIds } }, { idempotencyKey: paymentKey }] }
      });
      if (submissionId) {
        await prisma.questionnaireAnswer.deleteMany({ where: { submissionId } });
        await prisma.questionnaireSubmission.deleteMany({ where: { id: submissionId } });
      }
      await prisma.availabilityRule.deleteMany({ where: { serviceId } });
      await prisma.bookingSlot.deleteMany({ where: { id: slotId } });
      await prisma.auditEvent.deleteMany({
        where: {
          OR: [
            { targetId: { in: [serviceId, slotId, ...bookingIds] } },
            ...(submissionId ? [{ targetId: submissionId }] : []),
            { metadata: { path: ["serviceId"], equals: serviceId } }
          ]
        }
      });
      await prisma.service.deleteMany({ where: { id: serviceId } });
      await prisma.$disconnect();
    });

    await prisma.service.create({
      data: {
        id: serviceId,
        category: "contract-test",
        bookingEnabled: true,
        fixture: true
      }
    });
    await prisma.bookingSlot.create({
      data: {
        id: slotId,
        serviceId,
        startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 25 * 60 * 60 * 1000),
        timezone: "UTC",
        status: "AVAILABLE"
      }
    });

    const rule = await bookingRepository.createAvailabilityRule(
      {
        serviceId,
        timezone: "UTC",
        weekday: 1,
        startMinute: 600,
        endMinute: 720,
        active: true
      },
      actor
    );
    assert.equal(rule.serviceId, serviceId);
    assert.equal((await bookingRepository.listAvailabilityRules({ serviceId })).length, 1);

    const bookingInput = {
      serviceId,
      slotId,
      locale: "en",
      clientTimezone: "UTC",
      idempotencyKey: bookingKey
    };
    const [first, second] = await Promise.all([
      bookingRepository.createBooking(bookingInput),
      bookingRepository.createBooking({ ...bookingInput, idempotencyKey: `${bookingKey}-competitor` })
    ]);
    const created = [first, second].find((result) => !result.error);
    const rejected = [first, second].find((result) => result.error);
    assert.equal(created.status, "pending_payment");
    assert.equal(rejected.error, "SLOT_UNAVAILABLE");

    const repeated = await bookingRepository.createBooking(bookingInput);
    if (!first.error) assert.equal(repeated.id, first.id);

    const reconciliation = await bookingRepository.reconcilePayment({
      bookingId: created.id,
      provider: "contract-test",
      status: "succeeded",
      amountMinor: 0,
      currency: "USD",
      idempotencyKey: paymentKey
    });
    assert.equal(reconciliation.booking.status, "confirmed");
    const repeatedPayment = await bookingRepository.reconcilePayment({
      bookingId: created.id,
      provider: "contract-test",
      status: "succeeded",
      amountMinor: 0,
      currency: "USD",
      idempotencyKey: paymentKey
    });
    assert.equal(repeatedPayment.payment.id, reconciliation.payment.id);
    assert.equal(repeatedPayment.booking.id, reconciliation.booking.id);

    const questionnaire = await questionnaireRepository.getQuestionnaire();
    assert.equal(questionnaire.id, "questionnaire-orientation");
    const submission = await questionnaireRepository.submitQuestionnaire(questionnaire.id, {
      locale: "en",
      answers: { matterType: "orientation", jurisdiction: "DEMO" }
    });
    submissionId = submission.id;
    assert.equal(submission.status, "received");
  }
);
