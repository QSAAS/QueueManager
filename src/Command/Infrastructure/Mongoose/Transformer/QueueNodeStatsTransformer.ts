import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IQueueNodeStats from "@app/Command/Infrastructure/Mongoose/Types/IQueueNodeStats";
import QueueNodeStats from "@app/Command/Domain/Entity/QueueNodeStats";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class QueueNodeStatsTransformer implements GenericTransformer<IQueueNodeStats, QueueNodeStats> {
  domainInstanceFrom(object: IQueueNodeStats): QueueNodeStats {
    return new QueueNodeStats(
      QueueNodeId.from(object.queueNodeId),
      object.countServed,
      object.totalTime);
  }

  mongooseObjectFrom(instance: QueueNodeStats): IQueueNodeStats {
    return {
      queueNodeId: instance.getQueueNodeId().toString(),
      countServed: instance.getCountServed(),
      totalTime: instance.getTotalTime(),
    };
  }

}
