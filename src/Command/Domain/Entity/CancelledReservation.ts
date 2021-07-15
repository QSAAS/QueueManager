import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default class CancelledReservation {
  constructor(private id: ReservationId, private serviceCancelTime: Date) {}
}
