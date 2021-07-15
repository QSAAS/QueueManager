import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IQueueServer from "@app/Command/Infrastructure/Mongoose/Types/IQueueServer";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";

export default class QueueServerMongooseTransformer implements GenericTransformer<IQueueServer, QueueServer> {
  domainInstanceFrom(object: IQueueServer): QueueServer {
    return new QueueServer(
      QueueServerId.from(object.id),
      object.assignedQueueNodeIds.map(id => QueueNodeId.from(id))
    );
  }

  mongooseObjectFrom(instance: QueueServer): IQueueServer {
    return {
      id: instance.getId().toString(),
      assignedQueueNodeIds: instance
        .getAssignedQueueNodeIds()
        .map(id => id.toString())
    };
  }

}
