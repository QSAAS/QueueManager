import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class CompleteReservation {
  constructor(private reservationId: ReservationId,
              private queueNodeId: QueueNodeId,
              private serviceStartTime: Date,
              private serviceEndTime: Date) {}
}
