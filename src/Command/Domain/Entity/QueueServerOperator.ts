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
import QueueServerBecameBusy from "@app/Command/Domain/Event/QueueServerBecameBusy";
import ReservationStartedProcessing from "@app/Command/Domain/Event/ReservationStartedProcessing";

export default class QueueServerOperator extends AggregateRoot {
  constructor(
    private id: QueueServerOperatorId,
    private assignedQueueServerIds: QueueServerId[],
    private assignedQueueNodeIds: QueueNodeId[],
    private activeQueueServers: ActiveQueueServer[],
  ) {
    super();
  }

  public getId(): QueueServerOperatorId {
    return this.id;
  }

  public getAssignedQueueServerIds(): QueueServerId[] {
    return this.assignedQueueServerIds;
  }

  public getAssignedQueueNodeIds(): QueueNodeId[] {
    return this.assignedQueueNodeIds;
  }

  public getActiveQueueServers(): ActiveQueueServer[] {
    return this.activeQueueServers;
  }

  public activate(queueServer: QueueServer) {
    if (!this.hasAssignedQueueServer(queueServer)) throw new ServerOperatorNotAllowedToAccessServer();
    if (this.hasActiveQueueServer(queueServer)) throw new QueueServerIsActive();
    this.activeQueueServers.push(new ActiveQueueServer(queueServer.getId(), null));
    this.raiseEvent(new QueueServerActivated(queueServer));
  }

  public deactivate(queueServer: QueueServer) {
    const activeServer = this.getActiveServer(queueServer);
    const completeReservation = activeServer.completeReservation();
    this.activeQueueServers.filter((other) => !other.getId().equals(queueServer.getId()));
    this.raiseEvent(new ReservationCompleted(completeReservation));
    this.raiseEvent(new QueueServerDeactivated(queueServer));
  }

  public markAsFree(queueServer: QueueServer) {
    const activeServer = this.getActiveServer(queueServer);
    const completeReservation = activeServer.completeReservation();
    this.raiseEvent(new ReservationCompleted(completeReservation));
    this.raiseEvent(new QueueServerBecameFree(queueServer));
  }

  public startProcessingReservation(queueServer: QueueServer, activeReservation: ActiveReservation) {
    const activeServer = this.getActiveServer(queueServer);
    activeServer.assign(activeReservation);
    this.raiseEvent(new QueueServerBecameBusy(queueServer));
    this.raiseEvent(new ReservationStartedProcessing(activeReservation));
  }

  private hasActiveQueueServer(queueServer: QueueServer): boolean {
    return this.activeQueueServers.find((other) => other.getId().equals(queueServer.getId())) !== undefined;
  }

  private hasAssignedQueueServer(queueServer: QueueServer) {
    return this.assignedQueueServerIds.find((id) => id.equals(queueServer.getId())) !== undefined;
  }

  private getActiveServer(queueServer: QueueServer): ActiveQueueServer {
    if (!this.hasAssignedQueueServer(queueServer)) throw new ServerOperatorNotAllowedToAccessServer();
    const activeServer = this.activeQueueServers.find((server) => server.getId().equals(queueServer.getId()));
    if (!activeServer) throw new QueueServerIsInactive();
    return activeServer;
  }
}
