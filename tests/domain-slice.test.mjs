import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission } from "../auth.config.mjs";
import { evaluateSubmission, getQuestionnaire } from "../questionnaire-repository.mjs";
import {
  createAvailabilityRule,
  createBooking,
  listBookingSlots,
  reconcilePayment,
  resetDevelopmentBookings,
  updateBookingStatus
} from "../booking-repository.mjs";

test("RBAC grants platform administrators all permissions", () => {
  assert.equal(hasPermission("PLATFORM_ADMIN", "service.approve"), true);
  assert.equal(hasPermission("PUBLIC_USER", "service.approve"), false);
});

test("published questionnaire validation identifies missing required answers", async () => {
  const questionnaire = await getQuestionnaire();
  const missing = evaluateSubmission(questionnaire, { matterType: "orientation" });
  assert.equal(missing.ok, false);
  assert.deepEqual(missing.missing, ["jurisdiction"]);

  const complete = evaluateSubmission(questionnaire, {
    matterType: "orientation",
    jurisdiction: "DEMO"
  });
  assert.equal(complete.ok, true);
  assert.equal(complete.version, 1);
});

test("booking and payment operations are idempotent and reconcile state", async () => {
  resetDevelopmentBookings();
  const [slot] = await listBookingSlots({ timezone: "America/New_York" });
  const bookingInput = {
    serviceId: slot.serviceId,
    slotId: slot.id,
    locale: "en",
    clientTimezone: "America/New_York",
    idempotencyKey: "booking-test-key"
  };
  const booking = await createBooking(bookingInput);
  const repeatedBooking = await createBooking(bookingInput);
  assert.equal(repeatedBooking.id, booking.id);
  assert.equal(booking.status, "pending_payment");

  const paymentInput = {
    bookingId: booking.id,
    provider: "development",
    status: "succeeded",
    amountMinor: 0,
    currency: "USD",
    idempotencyKey: "payment-test-key"
  };
  const result = await reconcilePayment(paymentInput);
  const repeatedPayment = await reconcilePayment(paymentInput);
  assert.equal(result.booking.status, "confirmed");
  assert.equal(repeatedPayment.payment.id, result.payment.id);
  assert.equal(repeatedPayment.booking.id, result.booking.id);
  const conflictingPayment = await reconcilePayment({
    ...paymentInput,
    bookingId: "different-booking"
  });
  assert.equal(conflictingPayment.error, "IDEMPOTENCY_KEY_CONFLICT");
});

test("availability rejects invalid time zones and booking status updates are idempotent", async () => {
  const actor = { id: "dev-admin", role: "platform_admin" };
  const invalidRule = await createAvailabilityRule(
    {
      serviceId: "service-orientation",
      timezone: "Not/AZone",
      weekday: 2,
      startMinute: 540,
      endMinute: 600
    },
    actor
  );
  assert.equal(invalidRule.error, "INVALID_AVAILABILITY_RULE");

  resetDevelopmentBookings();
  const [slot] = await listBookingSlots();
  const booking = await createBooking({
    serviceId: slot.serviceId,
    slotId: slot.id,
    locale: "en",
    clientTimezone: "UTC",
    idempotencyKey: "status-idempotency-booking"
  });
  const cancelled = await updateBookingStatus(booking.id, "cancelled", actor);
  const repeated = await updateBookingStatus(booking.id, "cancelled", actor);
  assert.equal(cancelled.status, "cancelled");
  assert.equal(repeated.status, "cancelled");

  const invalidRevival = await updateBookingStatus(booking.id, "confirmed", actor);
  assert.equal(invalidRevival.error, "INVALID_BOOKING_TRANSITION");
  const latePayment = await reconcilePayment({
    bookingId: booking.id,
    provider: "development-admin",
    status: "succeeded",
    amountMinor: 0,
    currency: "USD",
    idempotencyKey: "cancelled-booking-payment",
    actor
  });
  assert.equal(latePayment.error, "BOOKING_NOT_PAYABLE");
  assert.equal(booking.status, "cancelled");
});
