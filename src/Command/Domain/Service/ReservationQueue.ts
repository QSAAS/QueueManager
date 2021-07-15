import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";

export default interface ReservationQueue {
  getNextReservation(id :QueueNodeId): Promise<ActiveReservation>;
}
