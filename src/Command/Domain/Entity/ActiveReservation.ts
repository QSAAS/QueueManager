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

  public getQueueNodeId(): QueueNodeId {
    return this.queueNodeId;
  }

  public getReservationTime() {
    return this.reservationTime;
  }

  getVerificationNumber(): VerificationNumber {
    return this.verificationNumber;
  }

  getNumberInQueue(): QueueNumber {
    return this.numberInQueue;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }
}
