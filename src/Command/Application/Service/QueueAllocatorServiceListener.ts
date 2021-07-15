import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerBecameFree from "@app/Command/Domain/Event/QueueServerBecameFree";
import QueueServerAllocatorService from "@app/Command/Domain/Service/QueueServerAllocatorService";
import NewReservationCreated from "@app/Command/Domain/Event/NewReservationCreated";
import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import NextActiveReservationNotFoundForQueueServer
  from "@app/Command/Domain/Error/NextActiveReservationNotFoundForQueueServer";
import QueueServerOperatorNotFoundForServer from "@app/Command/Domain/Error/QueueServerOperatorNotFoundForServer";

export default class QueueAllocatorServiceListener {
  constructor(private queueServerOperatorRepository: QueueServerOperatorRepository,
              private queueServerAllocatorService: QueueServerAllocatorService,
              private queueServerRepository: QueueServerRepository) {
  }

  public async executeBecauseServerBecameFree(event: QueueServerBecameFree): Promise<void> {
    const server = event.getQueueServer();
    await this.assignReservationToServer(server);
  }

  private async assignReservationToServer(server: QueueServer) {
    try {
      const activeReservation = await this.queueServerAllocatorService.getNextActiveReservation(server);
      const operator = await this.queueServerOperatorRepository.getOperatorByQueueServer(server.getId());
      operator.startProcessingReservation(server, activeReservation);
      await this.queueServerOperatorRepository.update(operator);
    } catch (e) {
      if (!(e instanceof NextActiveReservationNotFoundForQueueServer || e instanceof QueueServerOperatorNotFoundForServer))
        throw e;
    }
  }

  public async executeBecauseNewReservationCreated(event: NewReservationCreated) {
    const activeReservation = event.getActiveReservation();
    const servers = await this.queueServerRepository.getByQueueNode(activeReservation.getQueueNodeId());
    servers.map(server => this.assignReservationToServer(server));
  }
}
