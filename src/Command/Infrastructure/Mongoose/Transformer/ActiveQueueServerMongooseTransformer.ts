import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IActiveQueueServer from "@app/Command/Infrastructure/Mongoose/Types/IActiveQueueServer";
import ActiveQueueServer from "@app/Command/Domain/Entity/ActiveQueueServer";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import InServiceRegistrationMongooseTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/InServiceRegistrationMongooseTransformer";

export default class ActiveQueueServerMongooseTransformer
  implements GenericTransformer<IActiveQueueServer, ActiveQueueServer>
{
  constructor(private readonly inServiceRegistrationMongooseTransformer: InServiceRegistrationMongooseTransformer) {}

  domainInstanceFrom(object: IActiveQueueServer): ActiveQueueServer {
    return new ActiveQueueServer(
      QueueServerId.from(object.id),
      object.reservation ? this.inServiceRegistrationMongooseTransformer.domainInstanceFrom(object.reservation) : null,
    );
  }

  mongooseObjectFrom(instance: ActiveQueueServer): IActiveQueueServer {
    const reservation = instance.getReservation();
    return {
      id: instance.getId().toString(),
      reservation: reservation ? this.inServiceRegistrationMongooseTransformer.mongooseObjectFrom(reservation) : null,
    };
  }
}
