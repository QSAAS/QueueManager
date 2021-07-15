import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IInServiceReservation from "@app/Command/Infrastructure/Mongoose/Types/IInServiceReservation";
import InServiceReservation from "@app/Command/Domain/Entity/InServiceReservation";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default class InServiceRegistrationMongooseTransformer
  implements GenericTransformer<IInServiceReservation, InServiceReservation> {
  domainInstanceFrom(object: IInServiceReservation): InServiceReservation {
    return new InServiceReservation(
      ReservationId.from(object.id),
      new Date(object.serviceStartTime),
    );
  }

  mongooseObjectFrom(instance: InServiceReservation): IInServiceReservation {
    return {
      id: instance.getId().toString(),
      serviceStartTime: instance.getServiceStartTime().toString(),
    }
  }

}
