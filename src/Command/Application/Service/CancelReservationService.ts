import ClientCancelReservationService from "@app/Command/Domain/Service/ClientCancelReservationService";
import CancelReservationRequest from "@app/Command/Application/DataTransferObject/Request/CancelReservationRequest";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default class CancelReservationService {
  constructor(private cancelService: ClientCancelReservationService) {
  }

  public async execute(request: CancelReservationRequest): Promise<void> {
    const clientId = new ClientId(request.clientId);
    const reservationId = new ReservationId(request.reservationId);
    await this.cancelService.execute(clientId, reservationId);
  }
}
