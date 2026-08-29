export class BookingProvider {
  async listSlots() {
    throw new Error("BookingProvider.listSlots must be implemented");
  }

  async createHold() {
    throw new Error("BookingProvider.createHold must be implemented");
  }
}

export class PaymentProvider {
  async reconcile() {
    throw new Error("PaymentProvider.reconcile must be implemented");
  }
}

export class DevelopmentBookingProvider extends BookingProvider {
  constructor(repository) {
    super();
    this.repository = repository;
  }

  listSlots(input) {
    return this.repository.listBookingSlots(input);
  }

  createHold(input) {
    return this.repository.createBooking(input);
  }
}

export class DevelopmentPaymentProvider extends PaymentProvider {
  constructor(repository) {
    super();
    this.repository = repository;
  }

  reconcile(input) {
    return this.repository.reconcilePayment(input);
  }
}
