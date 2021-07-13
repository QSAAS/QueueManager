import DomainEvent from "@app/Command/Domain/Event/DomainEvent";
import CancelledReservation from "@app/Command/Domain/Entity/CancelledReservation";

export default class ReservationCancelled extends DomainEvent {
  constructor(private reservation: CancelledReservation) {
    super();
  }

  public getCancelledReservation(): CancelledReservation {
    return this.reservation;
  }
}
