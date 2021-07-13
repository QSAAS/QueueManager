import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default class InServiceReservation {
  constructor(private id: ReservationId,
              private serviceStartTime: Date) {}

  public getId(): ReservationId {
    return this.id;
  }

  public getServiceStartTime(): Date {
    return this.serviceStartTime;
  }
}
