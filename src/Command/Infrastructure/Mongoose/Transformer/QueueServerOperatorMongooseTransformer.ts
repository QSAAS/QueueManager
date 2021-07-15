import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IQueueServerOperator from "@app/Command/Infrastructure/Mongoose/Types/IQueueServerOperator";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";
import ActiveQueueServerMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/ActiveQueueServerMongooseTransformer";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class QueueServerOperatorMongooseTransformer
  implements GenericTransformer<IQueueServerOperator, QueueServerOperator> {

  constructor(private readonly activeQueueServerMongooseTransformer: ActiveQueueServerMongooseTransformer) {
  }

  domainInstanceFrom(object: IQueueServerOperator): QueueServerOperator {
    return new QueueServerOperator(
      QueueServerOperatorId.from(object.id),
      object.assignedQueueServerIds.map(id => QueueServerId.from(id)),
      object.assignedQueueNodeIds.map(id => QueueNodeId.from(id)),
      object.activeQueueServers.map(s => this.activeQueueServerMongooseTransformer.domainInstanceFrom(s))
    );
  }

  mongooseObjectFrom(instance: QueueServerOperator): IQueueServerOperator {
    return {
      id: instance.getId().toString(),
      assignedQueueServerIds: instance.getAssignedQueueServerIds().map(id => id.toString()),
      assignedQueueNodeIds: instance.getAssignedQueueNodeIds().map(id => id.toString()),
      activeQueueServers: instance.getActiveQueueServers()
        .map(s => this.activeQueueServerMongooseTransformer.mongooseObjectFrom(s))
    };
  }

}
