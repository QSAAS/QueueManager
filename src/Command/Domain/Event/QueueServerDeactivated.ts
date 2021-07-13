import DomainEvent from "@app/Command/Domain/Event/DomainEvent";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";

export default class QueueServerDeactivated extends DomainEvent {
  constructor(private queueServer: QueueServer) {
    super();
  }

  public getQueueServer(): QueueServer {
    return this.queueServer;
  }
}
