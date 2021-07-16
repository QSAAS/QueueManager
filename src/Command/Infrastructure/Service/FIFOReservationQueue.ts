import ReservationQueue from "@app/Command/Domain/Service/ReservationQueue";
import ActiveReservationRepository from "@app/Command/Domain/Service/ActiveReservationRepository";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import NextActiveReservationNotFoundForQueueNode from "@app/Command/Domain/Error/NextActiveReservationNotFoundForQueueNode";
import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";

export default class FIFOReservationQueue implements ReservationQueue {
  constructor(private readonly activeReservationRepository: ActiveReservationRepository,
              private readonly queueServerOperatorRepository: QueueServerOperatorRepository) {}

  public async getNextReservation(id: QueueNodeId): Promise<ActiveReservation> {
    const activeReservations = await this.activeReservationRepository.getByQueueNode(id);
    activeReservations.filter(r => {
      const operator = this.queueServerOperatorRepository.getOperatorByReservation(r.getId());
      return operator === null;
    });
    if (!activeReservations.length) throw new NextActiveReservationNotFoundForQueueNode();
    activeReservations.sort((a, b) => a.getReservationTime().getTime() - b.getReservationTime().getTime());
    return activeReservations[activeReservations.length - 1];
  }
}
