import DomainEvent from "@app/Command/Domain/Event/DomainEvent";
import CompleteReservation from "@app/Command/Domain/Entity/CompleteReservation";

export default class ReservationCompleted extends DomainEvent {
  constructor(private reservation: CompleteReservation) {
    super();
  }

  public getCompleteReservation(): CompleteReservation {
    return this.reservation;
  }
}
