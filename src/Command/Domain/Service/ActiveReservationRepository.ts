import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default interface ActiveReservationRepository {
  getById(id: ReservationId): Promise<ActiveReservation>;
  save(reservation: ActiveReservation): Promise<void>;
  delete(reservation: ActiveReservation): Promise<void>;
}
