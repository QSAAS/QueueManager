import QueueServerAllocatorService from "@app/Command/Domain/Service/QueueServerAllocatorService";
import ReservationQueue from "@app/Command/Domain/Service/ReservationQueue";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import NextActiveReservationNotFoundForQueueServer from "@app/Command/Domain/Error/NextActiveReservationNotFoundForQueueServer";

export default class ArbitraryQueueServerAllocatorService implements QueueServerAllocatorService {
  constructor(private readonly reservationQueue: ReservationQueue) {}

  public async getNextActiveReservation(queueServer: QueueServer): Promise<ActiveReservation> {
    let arbitraryNextReservation;
    try {
      arbitraryNextReservation = await Promise.any(
        queueServer.getAssignedQueueNodeIds().map((id) => this.reservationQueue.getNextReservation(id)),
      );
    } catch (e) {
      throw new NextActiveReservationNotFoundForQueueServer();
    }
    return arbitraryNextReservation;
  }
}
