import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerBecameFree from "@app/Command/Domain/Event/QueueServerBecameFree";
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
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";
import VerificationNumber from "@app/Command/Domain/ValueObject/VerificationNumber";
import QueueNumber from "@app/Command/Domain/ValueObject/QueueNumber";
import Metadata from "@app/Command/Domain/ValueObject/Metadata";

interface ReservationCreatedEvent extends IncomingEvent {
  data: {
    client: string;
    created_at: string;
    queue_node: string;
    reservation_id: number;
    verification_number: string
  }
}


export default class QueueAllocatorServiceListener implements EventListener<ReservationCreatedEvent> {
  constructor(
    private queueServerOperatorRepository: QueueServerOperatorRepository,
    private queueServerAllocatorService: QueueServerAllocatorService,
    private queueServerRepository: QueueServerRepository,
    private activeReservationRepository: ActiveReservationRepository,
  ) {
  }

  public async execute(event: ReservationCreatedEvent): Promise<void> {
    const reservation = new ActiveReservation(
      ReservationId.from(event.data.reservation_id.toString()),
      ClientId.from(event.data.client),
      QueueNodeId.from(event.data.queue_node),
      new Date(event.data.created_at),
      VerificationNumber.from(event.data.verification_number),
      QueueNumber.from(event.data.reservation_id.toString()),
      new Metadata([]),
    );
    await this.activeReservationRepository.save(reservation);
    const servers = await this.queueServerRepository.getByQueueNode(QueueNodeId.from(event.data.queue_node));
    await Promise.all(servers.map(async (server) => {
      await this.assignReservationToServer(server);
    }));
  }

  public async executeBecauseServerBecameFree(event: QueueServerBecameFree): Promise<void> {
    const server = event.getQueueServer();
    await this.assignReservationToServer(server);
  };

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
