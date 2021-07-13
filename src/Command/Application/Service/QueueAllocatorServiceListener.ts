import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerBecameFree from "@app/Command/Domain/Event/QueueServerBecameFree";
import QueueServerAllocatorService from "@app/Command/Domain/Service/QueueServerAllocatorService";

export default class QueueAllocatorServiceListener {
  constructor(private queueServerOperatorRepository: QueueServerOperatorRepository,
              private queueServerAllocatorService: QueueServerAllocatorService) {
  }

  public async execute(event: QueueServerBecameFree): Promise<void> {
    const server = event.getQueueServer();
    try {
      const activeReservation = await this.queueServerAllocatorService.getNextActiveReservation(server);
      const operator = await this.queueServerOperatorRepository.getOperatorByQueueServer(server.getId());
      operator.startProcessingReservation(server, activeReservation);
      await this.queueServerOperatorRepository.update(operator);
    } catch(e) {}

  }
}
