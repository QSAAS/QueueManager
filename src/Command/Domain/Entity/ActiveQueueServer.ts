import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import InServiceReservation from "@app/Command/Domain/Entity/InServiceReservation";
import ActiveQueueServerIsBusy from "@app/Command/Domain/Error/ActiveQueueServerIsBusy";
import ActiveQueueServerIsFree from "@app/Command/Domain/Error/ActiveQueueServerIsFree";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import CompleteReservation from "@app/Command/Domain/Entity/CompleteReservation";

export default class ActiveQueueServer {
  constructor(private id: QueueServerId, private reservation: InServiceReservation | null) {}

  public assign(reservation: ActiveReservation): void {
    if (this.reservation !== null) throw new ActiveQueueServerIsBusy();
    this.reservation = new InServiceReservation(reservation.getId(),
      new Date(),
      reservation.getQueueNodeId());
  }

  public getId(): QueueServerId {
    return this.id;
  }

  public getReservation(): InServiceReservation | null {
    return this.reservation;
  }

  public completeReservation(): CompleteReservation {
    if (this.reservation === null) throw new ActiveQueueServerIsFree();
    const completeReservation = new CompleteReservation(
      this.reservation.getId(),
      this.reservation.getQueueNodeId(),
      this.reservation.getServiceStartTime(),
      new Date(),
    );
    this.reservation = null;
    return completeReservation;
  }

  public isBusy(): boolean {
    return this.reservation !== null;
  }
}
