import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default class CompleteReservation {
  constructor(private id: ReservationId, private serviceStartTime: Date, private serviceEndTime: Date) {}
}
