import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerAllocatorService from "@app/Command/Domain/Service/QueueServerAllocatorService";
import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import NextActiveReservationNotFoundForQueueServer
  from "@app/Command/Domain/Error/NextActiveReservationNotFoundForQueueServer";
import QueueServerOperatorNotFoundForServer from "@app/Command/Domain/Error/QueueServerOperatorNotFoundForServer";
import ActiveReservationRepository from "@app/Command/Domain/Service/ActiveReservationRepository";
import ActiveQueueServerIsBusy from "@app/Command/Domain/Error/ActiveQueueServerIsBusy";
import QueueServerIsInactive from "@app/Command/Domain/Error/QueueServerIsInactive";
import EventListener from "@app/Command/Application/EventListener/EventListener";
import { IncomingEvent } from "@app/Command/Domain/Service/EventBus";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";

interface QueueServerBecameFree extends IncomingEvent {
  data: {
    queueServer: {
      id: string,
      assignedQueueNodeIds: {
        id: string
      }[]
    }
  }
}

export default class QueueAllocatorBecameFreeServiceListener implements EventListener<QueueServerBecameFree> {
  constructor(
    private queueServerOperatorRepository: QueueServerOperatorRepository,
    private queueServerAllocatorService: QueueServerAllocatorService,
    private queueServerRepository: QueueServerRepository,
    private activeReservationRepository: ActiveReservationRepository,
  ) {
  }

  public async execute(event: QueueServerBecameFree): Promise<void> {
    const server = await this.queueServerRepository.getById(QueueServerId.from(event.data.queueServer.id));
    await this.assignReservationToServer(server);
  }

  private async assignReservationToServer(server: QueueServer) {
    try {
      const activeReservation = await this.queueServerAllocatorService.getNextActiveReservation(server);
      const operator = await this.queueServerOperatorRepository.getOperatorByQueueServer(server.getId());
      operator.startProcessingReservation(server, activeReservation);
      await this.queueServerOperatorRepository.update(operator);
      await this.activeReservationRepository.delete(activeReservation);
    } catch (e) {
      if (
        !(e instanceof NextActiveReservationNotFoundForQueueServer || e instanceof QueueServerOperatorNotFoundForServer
          || e instanceof ActiveQueueServerIsBusy || e instanceof QueueServerIsInactive)
      )
        throw e;
    }
  }
}
