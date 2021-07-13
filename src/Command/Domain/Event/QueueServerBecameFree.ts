import DomainEvent from "@app/Command/Domain/Event/DomainEvent";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";

export default class QueueServerBecameFree extends DomainEvent {
  constructor(private server: QueueServer) {
    super();
  }

  public getQueueServer(): QueueServer {
    return this.server;
  }
}
