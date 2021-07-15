import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default interface QueueServerRepository {
  getById(id: QueueServerId): Promise<QueueServer>;
  save(queueServeOperator: QueueServerOperator): Promise<void>;
  getByQueueNode(queueNodeId: QueueNodeId): Promise<QueueServer[]>;
}
