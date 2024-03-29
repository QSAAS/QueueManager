import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";

export default interface ActiveReservationRepository {
  getById(id: ReservationId): Promise<ActiveReservation>;
  getByQueueNode(id: QueueNodeId): Promise<ActiveReservation[]>;
  save(reservation: ActiveReservation): Promise<void>;
  delete(reservation: ActiveReservation): Promise<void>;
  getByClientId(id: ClientId): Promise<ActiveReservation[]>;
}
