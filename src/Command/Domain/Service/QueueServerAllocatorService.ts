import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";

export default interface QueueServerAllocatorService {
  getNextActiveReservation(queueServer: QueueServer): Promise<ActiveReservation>;
}
