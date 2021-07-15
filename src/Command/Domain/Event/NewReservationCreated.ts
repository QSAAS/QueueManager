import DomainEvent from "@app/Command/Domain/Event/DomainEvent";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";

export default class NewReservationCreated extends DomainEvent {
  constructor(private activeReservation: ActiveReservation) {
    super();
  }

  public getActiveReservation(): ActiveReservation {
    return this.activeReservation;
  }
}
