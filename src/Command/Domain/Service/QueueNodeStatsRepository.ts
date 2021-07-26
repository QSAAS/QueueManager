import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueNodeStats from "@app/Command/Domain/Entity/QueueNodeStats";

export default interface QueueNodeStatsRepository {
  addStat(queueNodeId: QueueNodeId, countServed: number, timeTaken: number): Promise<void>;
  getByQueueNodeId(queueNodeId: QueueNodeId): Promise<QueueNodeStats>;
}
