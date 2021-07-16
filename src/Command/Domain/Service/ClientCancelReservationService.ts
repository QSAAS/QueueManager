import ClientId from "@app/Command/Domain/ValueObject/ClientId";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import ActiveReservationRepository from "@app/Command/Domain/Service/ActiveReservationRepository";
import ReservationNotCancellable from "@app/Command/Domain/Error/ReservationNotCancellable";
import ClientNotAuthorizedToCancelReservation from "@app/Command/Domain/Error/ClientNotAuthorizedToCancelReservation";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import CancelledReservation from "@app/Command/Domain/Entity/CancelledReservation";
import AggregateRoot from "@app/Command/Domain/Entity/AggregateRoot";
import ReservationCancelled from "@app/Command/Domain/Event/ReservationCancelled";

export default class ClientCancelReservationService extends AggregateRoot {
  constructor(
    private queueServerOperatorRepository: QueueServerOperatorRepository,
    private activeReservationRepository: ActiveReservationRepository,
  ) {
    super();
  }

  public async execute(clientId: ClientId, reservationId: ReservationId): Promise<void> {
    let reservation: ActiveReservation;
    try {
      reservation = await this.activeReservationRepository.getById(reservationId);
    } catch (e) {
      console.log(`Reservation ${reservationId} not found`);
      throw new ReservationNotCancellable();
    }

    if (!reservation.getClientId().equals(clientId)) {
      console.log(`Client ${clientId} can't access Reservation ${reservationId}`);
      throw new ClientNotAuthorizedToCancelReservation();
    }

    try {
      await this.queueServerOperatorRepository.getOperatorByReservation(reservationId);
      throw new ReservationNotCancellable();
    } catch (e) {
      if (e instanceof ReservationNotCancellable) {
        console.log(`Reservation ${reservationId} is in service`);
        throw e;
      }
      const cancelledReservation = new CancelledReservation(reservationId, new Date());
      this.raiseEvent(new ReservationCancelled(cancelledReservation));
      await this.activeReservationRepository.delete(reservation);
    }
  }
}
