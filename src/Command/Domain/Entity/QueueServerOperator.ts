import AggregateRoot from "@app/Command/Domain/Entity/AggregateRoot";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import QueueServerIsActive from "@app/Command/Domain/Error/QueueServerIsActive";
import QueueServerActivated from "@app/Command/Domain/Event/QueueServerActivated";
import QueueServerIsInactive from "@app/Command/Domain/Error/QueueServerIsInactive";
import QueueServerDeactivated from "@app/Command/Domain/Event/QueueServerDeactivated";
import ActiveQueueServer from "@app/Command/Domain/Entity/ActiveQueueServer";
import ServerOperatorNotAllowedToAccessServer from "@app/Command/Domain/Error/ServerOperatorNotAllowedToAccessServer";
import QueueServerBecameFree from "@app/Command/Domain/Event/QueueServerBecameFree";
import ReservationCompleted from "@app/Command/Domain/Event/ReservationCompleted";

export default class QueueServerOperator extends AggregateRoot {
  constructor(private id: QueueServerOperatorId,
              private assignedQueueServerIds: QueueServerId[],
              private assignedQueueNodeIds: QueueNodeId[],
              private activeQueueServers: ActiveQueueServer[]) {
    super();
  }

  public activate(queueServer: QueueServer) {
    if (!this.hasAssignedQueueServer(queueServer))
      throw new ServerOperatorNotAllowedToAccessServer();
    if (this.hasActiveQueueServer(queueServer))
      throw new QueueServerIsActive();
    this.activeQueueServers.push(new ActiveQueueServer(queueServer.getId(), null));
    this.raiseEvent(new QueueServerActivated(queueServer));
  }

  public deactivate(queueServer: QueueServer) {
    if (!this.hasAssignedQueueServer(queueServer))
      throw new ServerOperatorNotAllowedToAccessServer();
    const activeServer = this.activeQueueServers.find(activeServer => activeServer.getId().equals(queueServer.getId()))
    if (!activeServer)
      throw new QueueServerIsInactive();
    this.activeQueueServers.filter(other => !other.getId().equals(queueServer.getId()));
    const completeReservation = activeServer.completeReservation();
    this.raiseEvent(new ReservationCompleted(completeReservation));
    this.raiseEvent(new QueueServerDeactivated(queueServer));
  }

  public markAsFree(queueServer: QueueServer) {
    if (!this.hasAssignedQueueServer(queueServer))
      throw new ServerOperatorNotAllowedToAccessServer();
    const activeServer = this.activeQueueServers.find(activeServer => activeServer.getId().equals(queueServer.getId()))
    if (!activeServer)
      throw new QueueServerIsInactive();
    const completeReservation = activeServer.completeReservation();
    this.raiseEvent(new ReservationCompleted(completeReservation));
    this.raiseEvent(new QueueServerBecameFree(queueServer));
  }

  public startProcessingReservation(queueServer: QueueServer,
                                    activeReservation: ActiveReservation) {
  }

  private hasActiveQueueServer(queueServer: QueueServer): boolean {
    return this.activeQueueServers.find(other => other.getId().equals(queueServer.getId())) !== undefined;
  }

  private hasAssignedQueueServer(queueServer: QueueServer) {
    return this.assignedQueueServerIds.find(id => id.equals(queueServer.getId())) !== undefined;
  }
}
