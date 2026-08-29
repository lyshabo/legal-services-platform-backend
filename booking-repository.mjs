import { randomUUID } from "node:crypto";
import { appendAudit } from "./server-repository.mjs";
import { getPrisma, prismaEnabled } from "./prisma-client.mjs";

const slots = new Map();
const bookings = new Map();
const payments = new Map();
const availabilityRules = new Map();

function lower(value) {
  return value?.toLowerCase?.() ?? value;
}

function isValidTimezone(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

function serializeBooking(booking) {
  if (!booking) return booking;
  return {
    ...booking,
    status: lower(booking.status),
    createdAt: booking.createdAt?.toISOString?.() ?? booking.createdAt,
    updatedAt: booking.updatedAt?.toISOString?.() ?? booking.updatedAt,
    slot: booking.slot
      ? {
          ...booking.slot,
          status: lower(booking.slot.status),
          startsAt: booking.slot.startsAt?.toISOString?.() ?? booking.slot.startsAt,
          endsAt: booking.slot.endsAt?.toISOString?.() ?? booking.slot.endsAt
        }
      : undefined,
    payment: booking.payment ? serializePayment(booking.payment) : undefined
  };
}

function serializePayment(payment) {
  return payment
    ? {
        ...payment,
        status: lower(payment.status),
        createdAt: payment.createdAt?.toISOString?.() ?? payment.createdAt,
        updatedAt: payment.updatedAt?.toISOString?.() ?? payment.updatedAt
      }
    : payment;
}

function seedSlots() {
  if (slots.size) return;
  const base = new Date("2026-09-01T13:00:00.000Z");
  for (let index = 0; index < 6; index += 1) {
    const startsAt = new Date(base.getTime() + index * 60 * 60 * 1000);
    const id = `slot-${index + 1}`;
    slots.set(id, {
      id,
      serviceId: "service-orientation",
      startsAt: startsAt.toISOString(),
      endsAt: new Date(startsAt.getTime() + 30 * 60 * 1000).toISOString(),
      timezone: "UTC",
      status: "available"
    });
  }
  if (!availabilityRules.size) {
    availabilityRules.set("rule-development", {
      id: "rule-development",
      serviceId: "service-orientation",
      timezone: "America/New_York",
      weekday: 2,
      startMinute: 540,
      endMinute: 1020,
      active: true
    });
  }
}

export async function listBookingSlots({ serviceId = "service-orientation", timezone = "UTC" } = {}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    const stored = await prisma.bookingSlot.findMany({
      where: { serviceId, status: "AVAILABLE", startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" }
    });
    return stored.map((slot) => ({
      ...slot,
      startsAt: slot.startsAt.toISOString(),
      endsAt: slot.endsAt.toISOString(),
      status: lower(slot.status),
      requestedTimezone: timezone
    }));
  }
  seedSlots();
  return [...slots.values()]
    .filter((slot) => slot.serviceId === serviceId && slot.status === "available")
    .map((slot) => ({ ...slot, requestedTimezone: timezone }));
}

export async function createBooking({
  serviceId,
  slotId,
  locale = "en",
  clientTimezone = "UTC",
  idempotencyKey
}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    const existing = await prisma.booking.findUnique({ where: { idempotencyKey } });
    if (existing) return serializeBooking(existing);
    try {
      return await prisma.$transaction(
        async (tx) => {
          const [slot] = await tx.$queryRaw`
            SELECT * FROM "BookingSlot" WHERE id = ${slotId} FOR UPDATE
          `;
          if (!slot || slot.serviceId !== serviceId || slot.status !== "AVAILABLE") {
            return { error: "SLOT_UNAVAILABLE", statusCode: 409 };
          }
          await tx.bookingSlot.update({
            where: { id: slotId },
            data: { status: "HOLD", holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000) }
          });
          const booking = await tx.booking.create({
            data: {
              serviceId,
              slotId,
              locale,
              clientTimezone,
              idempotencyKey,
              status: "PENDING_PAYMENT",
              statusHistory: {
                create: { from: null, to: "PENDING_PAYMENT", reason: "Slot held for payment" }
              }
            }
          });
          await tx.auditEvent.create({
            data: {
              action: "booking.created",
              targetType: "Booking",
              targetId: booking.id,
              metadata: { slotId, serviceId, clientTimezone }
            }
          });
          return serializeBooking(booking);
        },
        { isolationLevel: "Serializable" }
      );
    } catch (error) {
      if (error.code === "P2002") {
        return serializeBooking(await prisma.booking.findUnique({ where: { idempotencyKey } }));
      }
      if (error.code === "P2034") {
        const repeated = await prisma.booking.findUnique({ where: { idempotencyKey } });
        return repeated
          ? serializeBooking(repeated)
          : { error: "SLOT_UNAVAILABLE", statusCode: 409 };
      }
      throw error;
    }
  }

  seedSlots();
  if (bookings.has(idempotencyKey)) return bookings.get(idempotencyKey);
  const slot = slots.get(slotId);
  if (!slot || slot.serviceId !== serviceId || slot.status !== "available") {
    return { error: "SLOT_UNAVAILABLE", statusCode: 409 };
  }
  slot.status = "held";
  const booking = {
    id: randomUUID(),
    serviceId,
    slotId,
    locale,
    clientTimezone,
    status: "pending_payment",
    idempotencyKey,
    createdAt: new Date().toISOString()
  };
  bookings.set(idempotencyKey, booking);
  await appendAudit({
    action: "booking.created",
    targetType: "Booking",
    targetId: booking.id,
    metadata: { slotId, serviceId, clientTimezone },
    at: booking.createdAt
  });
  return booking;
}

export async function reconcilePayment({
  bookingId,
  provider = "development",
  providerReference,
  status,
  amountMinor = 0,
  currency = "USD",
  idempotencyKey
}) {
  const normalizedStatus = String(status || "").toLowerCase();
  if (
    !idempotencyKey ||
    !["succeeded", "failed", "requires_action", "created"].includes(normalizedStatus) ||
    !Number.isInteger(amountMinor) ||
    amountMinor < 0 ||
    typeof currency !== "string" ||
    !/^[A-Za-z]{3}$/.test(currency)
  ) {
    return { error: "INVALID_PAYMENT_INPUT", statusCode: 400 };
  }
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    const existing = await prisma.paymentAttempt.findUnique({ where: { idempotencyKey } });
    if (existing) {
      const booking = await prisma.booking.findUnique({ where: { paymentId: existing.id } });
      if (!booking || booking.id !== bookingId) {
        return { error: "IDEMPOTENCY_KEY_CONFLICT", statusCode: 409 };
      }
      return { payment: serializePayment(existing), booking: serializeBooking(booking) };
    }
    return prisma.$transaction(
      async (tx) => {
        const [booking] = await tx.$queryRaw`
          SELECT * FROM "Booking" WHERE id = ${bookingId} FOR UPDATE
        `;
        if (!booking) return { error: "BOOKING_NOT_FOUND", statusCode: 404 };
        const paymentStatus = normalizedStatus.toUpperCase();
        const allowed = ["SUCCEEDED", "FAILED", "REQUIRES_ACTION", "CREATED"];
        if (!allowed.includes(paymentStatus)) {
          return { error: "INVALID_PAYMENT_STATUS", statusCode: 400 };
        }
        const terminalSuccess = paymentStatus === "SUCCEEDED";
        const terminalFailure = paymentStatus === "FAILED";
        const nextBookingStatus = terminalSuccess
          ? "CONFIRMED"
          : terminalFailure
            ? "FAILED"
            : booking.status;
        const nextSlotStatus = terminalSuccess ? "CONFIRMED" : terminalFailure ? "AVAILABLE" : "HOLD";
        const payment = await tx.paymentAttempt.create({
          data: {
            provider,
            providerReference: providerReference ?? null,
            status: paymentStatus,
            amountMinor,
            currency,
            idempotencyKey
          }
        });
        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: nextBookingStatus,
            paymentId: payment.id,
            statusHistory:
              nextBookingStatus === booking.status
                ? undefined
                : {
                    create: {
                      from: booking.status,
                      to: nextBookingStatus,
                      reason: `Payment ${paymentStatus.toLowerCase()}`
                    }
                  }
          }
        });
        await tx.bookingSlot.update({
          where: { id: booking.slotId },
          data: { status: nextSlotStatus, holdExpiresAt: terminalSuccess || terminalFailure ? null : undefined }
        });
        await tx.auditEvent.create({
          data: {
            action: "payment.reconciled",
            targetType: "PaymentAttempt",
            targetId: payment.id,
            metadata: { bookingId, status: paymentStatus, provider }
          }
        });
        return { payment: serializePayment(payment), booking: serializeBooking(updatedBooking) };
      },
      { isolationLevel: "Serializable" }
    );
  }

  const existing = payments.get(idempotencyKey);
  if (existing) {
    if (existing.bookingId !== bookingId) {
      return { error: "IDEMPOTENCY_KEY_CONFLICT", statusCode: 409 };
    }
    const existingBooking = [...bookings.values()].find((item) => item.id === existing.bookingId);
    return { payment: existing, booking: existingBooking };
  }
  const booking = [...bookings.values()].find((item) => item.id === bookingId);
  if (!booking) return { error: "BOOKING_NOT_FOUND", statusCode: 404 };
  const payment = {
    id: randomUUID(),
    bookingId,
    provider,
    providerReference: providerReference ?? null,
    status,
    amountMinor,
    currency,
    idempotencyKey,
    createdAt: new Date().toISOString()
  };
  payments.set(idempotencyKey, payment);
  const slot = slots.get(booking.slotId);
  if (status === "succeeded") {
    booking.status = "confirmed";
    if (slot) slot.status = "confirmed";
  } else if (status === "failed") {
    booking.status = "failed";
    if (slot) slot.status = "available";
  }
  await appendAudit({
    action: "payment.reconciled",
    targetType: "PaymentAttempt",
    targetId: payment.id,
    metadata: { bookingId, status, provider },
    at: payment.createdAt
  });
  return { payment, booking };
}

export async function listBookings({ status } = {}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    const stored = await prisma.booking.findMany({
      where: status ? { status: status.toUpperCase() } : undefined,
      orderBy: { createdAt: "desc" },
      include: { slot: true, payment: true, statusHistory: { orderBy: { createdAt: "asc" } } }
    });
    return stored.map(serializeBooking);
  }
  seedSlots();
  return [...bookings.values()].filter((booking) => !status || booking.status === status);
}

export async function updateBookingStatus(bookingId, status, actor, reason = "Administrative update") {
  const nextStatus = status.toUpperCase();
  if (!["PENDING_PAYMENT", "CONFIRMED", "CANCELLED", "EXPIRED", "FAILED"].includes(nextStatus)) {
    return { error: "INVALID_BOOKING_STATUS", statusCode: 400 };
  }
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.$transaction(async (tx) => {
      const [booking] = await tx.$queryRaw`
        SELECT * FROM "Booking" WHERE id = ${bookingId} FOR UPDATE
      `;
      if (!booking) return null;
      if (booking.status === nextStatus) return serializeBooking(booking);
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: nextStatus,
          statusHistory: { create: { from: booking.status, to: nextStatus, reason } }
        }
      });
      if (["CANCELLED", "EXPIRED", "FAILED"].includes(nextStatus)) {
        await tx.bookingSlot.update({
          where: { id: booking.slotId },
          data: { status: "AVAILABLE", holdExpiresAt: null }
        });
      }
      if (nextStatus === "CONFIRMED") {
        await tx.bookingSlot.update({
          where: { id: booking.slotId },
          data: { status: "CONFIRMED", holdExpiresAt: null }
        });
      }
      await tx.auditEvent.create({
        data: {
          action: "booking.status.updated",
          actorId: actor.id,
          actorRole: actor.role.toUpperCase(),
          targetType: "Booking",
          targetId: bookingId,
          metadata: { from: booking.status, to: nextStatus, reason }
        }
      });
      return serializeBooking(updated);
    }, { isolationLevel: "Serializable" });
  }
  const booking = [...bookings.values()].find((item) => item.id === bookingId);
  if (!booking) return null;
  const from = booking.status;
  booking.status = lower(nextStatus);
  await appendAudit({
    action: "booking.status.updated",
    actorId: actor.id,
    actorRole: actor.role,
    targetType: "Booking",
    targetId: bookingId,
    metadata: { from, to: booking.status, reason }
  });
  return booking;
}

export async function listAvailabilityRules({ serviceId } = {}) {
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    return prisma.availabilityRule.findMany({
      where: serviceId ? { serviceId } : undefined,
      orderBy: [{ serviceId: "asc" }, { weekday: "asc" }, { startMinute: "asc" }]
    });
  }
  seedSlots();
  return [...availabilityRules.values()].filter((rule) => !serviceId || rule.serviceId === serviceId);
}

export async function createAvailabilityRule(payload, actor) {
  const data = {
    serviceId: payload.serviceId,
    timezone: payload.timezone,
    weekday: Number(payload.weekday),
    startMinute: Number(payload.startMinute),
    endMinute: Number(payload.endMinute),
    active: payload.active !== false
  };
  if (
    !isValidTimezone(data.timezone) ||
    data.weekday < 0 ||
    data.weekday > 6 ||
    data.startMinute < 0 ||
    data.endMinute > 1440 ||
    data.startMinute >= data.endMinute
  ) {
    return { error: "INVALID_AVAILABILITY_RULE", statusCode: 400 };
  }
  let rule;
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    rule = await prisma.$transaction(async (tx) => {
      const created = await tx.availabilityRule.create({ data });
      await tx.auditEvent.create({
        data: {
          action: "availability.created",
          actorId: actor.id,
          actorRole: actor.role.toUpperCase(),
          targetType: "AvailabilityRule",
          targetId: created.id,
          metadata: data
        }
      });
      return created;
    });
  } else {
    rule = { id: randomUUID(), ...data };
    availabilityRules.set(rule.id, rule);
  }
  if (!prismaEnabled()) {
    await appendAudit({
      action: "availability.created",
      actorId: actor.id,
      actorRole: actor.role,
      targetType: "AvailabilityRule",
      targetId: rule.id,
      metadata: data
    });
  }
  return rule;
}

export async function updateAvailabilityRule(id, payload, actor) {
  let rule;
  if (prismaEnabled()) {
    const prisma = await getPrisma();
    const existing = await prisma.availabilityRule.findUnique({ where: { id } });
    if (!existing) return null;
    const candidate = {
      timezone: payload.timezone ?? existing.timezone,
      weekday: payload.weekday === undefined ? existing.weekday : Number(payload.weekday),
      startMinute:
        payload.startMinute === undefined ? existing.startMinute : Number(payload.startMinute),
      endMinute: payload.endMinute === undefined ? existing.endMinute : Number(payload.endMinute),
      active: payload.active ?? existing.active
    };
    if (
      !isValidTimezone(candidate.timezone) ||
      candidate.weekday < 0 ||
      candidate.weekday > 6 ||
      candidate.startMinute < 0 ||
      candidate.endMinute > 1440 ||
      candidate.startMinute >= candidate.endMinute
    ) {
      return { error: "INVALID_AVAILABILITY_RULE", statusCode: 400 };
    }
    rule = await prisma.$transaction(async (tx) => {
      const updated = await tx.availabilityRule.update({
        where: { id },
        data: candidate
      });
      await tx.auditEvent.create({
        data: {
          action: "availability.updated",
          actorId: actor.id,
          actorRole: actor.role.toUpperCase(),
          targetType: "AvailabilityRule",
          targetId: id,
          metadata: payload
        }
      });
      return updated;
    });
  } else {
    rule = availabilityRules.get(id);
    if (!rule) return null;
    const candidate = { ...rule, ...payload };
    if (
      !isValidTimezone(candidate.timezone) ||
      Number(candidate.weekday) < 0 ||
      Number(candidate.weekday) > 6 ||
      Number(candidate.startMinute) < 0 ||
      Number(candidate.endMinute) > 1440 ||
      Number(candidate.startMinute) >= Number(candidate.endMinute)
    ) {
      return { error: "INVALID_AVAILABILITY_RULE", statusCode: 400 };
    }
    Object.assign(rule, candidate);
  }
  if (!prismaEnabled()) {
    await appendAudit({
      action: "availability.updated",
      actorId: actor.id,
      actorRole: actor.role,
      targetType: "AvailabilityRule",
      targetId: id,
      metadata: payload
    });
  }
  return rule;
}

export async function resetDevelopmentBookings() {
  if (prismaEnabled()) {
    return { reset: false, reason: "Prisma data is not cleared by the browser development reset." };
  }
  slots.clear();
  bookings.clear();
  payments.clear();
  availabilityRules.clear();
  seedSlots();
  return { reset: true };
}
