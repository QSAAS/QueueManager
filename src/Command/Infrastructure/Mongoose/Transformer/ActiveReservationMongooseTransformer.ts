import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IActiveReservation from "@app/Command/Infrastructure/Mongoose/Types/IActiveReservation";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import VerificationNumber from "@app/Command/Domain/ValueObject/VerificationNumber";
import QueueNumber from "@app/Command/Domain/ValueObject/QueueNumber";
import MetadataMongooseTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/MetadataMongooseTransformer";

export default class ActiveReservationMongooseTransformer
  implements GenericTransformer<IActiveReservation, ActiveReservation>
{
  constructor(private metadataMongooseTransformer: MetadataMongooseTransformer) {}

  domainInstanceFrom(object: IActiveReservation): ActiveReservation {
    return new ActiveReservation(
      ReservationId.from(object.reservationId),
      ClientId.from(object.clientId),
      QueueNodeId.from(object.queueNodeId),
      new Date(object.reservationTime),
      VerificationNumber.from(object.verificationNumber),
      QueueNumber.from(object.numberInQueue),
      this.metadataMongooseTransformer.domainInstanceFrom(object.metadata),
    );
  }

  mongooseObjectFrom(instance: ActiveReservation): IActiveReservation {
    return {
      reservationId: instance.getId().toString(),
      clientId: instance.getClientId().toString(),
      queueNodeId: instance.getQueueNodeId().toString(),
      reservationTime: instance.getReservationTime().toString(),
      verificationNumber: instance.getVerificationNumber().toString(),
      numberInQueue: instance.getNumberInQueue().toString(),
      metadata: this.metadataMongooseTransformer.mongooseObjectFrom(instance.getMetadata()),
    };
  }
}
