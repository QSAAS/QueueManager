import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class InServiceReservation {
  constructor(private id: ReservationId,
              private serviceStartTime: Date,
              private queueNodeId: QueueNodeId,) {}

  public getId(): ReservationId {
    return this.id;
  }

  public getServiceStartTime(): Date {
    return this.serviceStartTime;
  }

  public getQueueNodeId(): QueueNodeId {
    return this.queueNodeId;
  }
}
