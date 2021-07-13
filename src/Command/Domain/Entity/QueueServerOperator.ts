import AggregateRoot from "@app/Command/Domain/Entity/AggregateRoot";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import QueueServerAlreadyActive from "@app/Command/Domain/Error/QueueServerAlreadyActive";
import QueueServerActivated from "@app/Command/Domain/Event/QueueServerActivated";
import QueueServerAlreadyInactive from "@app/Command/Domain/Error/QueueServerAlreadyInactive";
import QueueServerDeactivated from "@app/Command/Domain/Event/QueueServerDeactivated";

export default class QueueServerOperator extends AggregateRoot {
  constructor(private id: QueueServerOperatorId,
              private assignedQueueServerIds: QueueServerId[],
              private assignedQueueNodeIds: QueueNodeId[],
              private activeQueueServers: QueueServer[]) {
    super();
  }

  public activate(queueServer: QueueServer) {
    if (this.hasActiveQueueServer(queueServer))
      throw new QueueServerAlreadyActive();
    this.activeQueueServers.push(queueServer);
    this.raiseEvent(new QueueServerActivated(queueServer));
  }

  public deactivate(queueServer: QueueServer) {
    if (!this.hasActiveQueueServer(queueServer))
      throw new QueueServerAlreadyInactive();
    this.activeQueueServers.filter(other => !other.getId().equals(queueServer.getId()));
    this.raiseEvent(new QueueServerDeactivated(queueServer));
  }

  public markAsFree(queueServer: QueueServer) {
  }

  public startProcessingReservation(queueServer: QueueServer,
                                    activeReservation: ActiveReservation) {
  }

  private hasActiveQueueServer(queueServer: QueueServer): boolean {
    return this.activeQueueServers.find(other => other.getId().equals(queueServer.getId())) !== undefined;
  }
}
