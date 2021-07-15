import AggregateRoot from "@app/Command/Domain/Entity/AggregateRoot";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class QueueServer extends AggregateRoot {
  constructor(private id: QueueServerId,
              private assignedQueueNodeIds: QueueNodeId[]) {
    super();
  }

  public getId(): QueueServerId {
    return this.id;
  }

  public getAssignedQueueNodeIds(): QueueNodeId[] {
    return this.assignedQueueNodeIds;
  }
}
