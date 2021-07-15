import AggregateRoot from "@app/Command/Domain/Entity/AggregateRoot";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import VerificationNumber from "@app/Command/Domain/ValueObject/VerificationNumber";
import QueueNumber from "@app/Command/Domain/ValueObject/QueueNumber";
import Metadata from "@app/Command/Domain/ValueObject/Metadata";

export default class ActiveReservation extends AggregateRoot {
  constructor(private reservationId: ReservationId,
              private clientId: ClientId,
              private queueNodeId: QueueNodeId,
              private reservationTime: Date,
              private verificationNumber: VerificationNumber,
              private numberInQueue: QueueNumber,
              // TODO: metadata
              private metadata: Metadata) {
    super();
  }

  public getId(): ReservationId {
    return this.reservationId;
  }

  public getClientId(): ClientId {
    return this.clientId;
  }

  getQueueNodeId(): QueueNodeId {
    return this.queueNodeId;
  }
}
