import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";
import { IncomingEvent } from "@app/Command/Domain/Service/EventBus";
import EventListener from "@app/Command/Application/EventListener/EventListener";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";


interface QueueServerCreated extends IncomingEvent {
  data: {
    queueServer: {
      queueServerId: { id: string },
      organizationSEndpointId: { id: string },
      serves: { id: string }[]
    }
  }
}

export default class SaveQueueServerService implements EventListener<QueueServerCreated> {
  constructor(private queueServerRepository: QueueServerRepository) {
  }

  public async execute(event: QueueServerCreated): Promise<void> {
    const data = event.data.queueServer;
    const server = new QueueServer(
      QueueServerId.from(data.queueServerId.id),
      data.serves.map((d) => QueueNodeId.from(d.id)),
    );
    await this.queueServerRepository.save(server);
  }
}
