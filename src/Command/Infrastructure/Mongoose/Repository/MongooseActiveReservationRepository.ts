import ActiveReservationRepository from "@app/Command/Domain/Service/ActiveReservationRepository";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import * as mongoose from "mongoose";
import IActiveReservation from "@app/Command/Infrastructure/Mongoose/Types/IActiveReservation";
import ActiveReservationMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/ActiveReservationMongooseTransformer";
import ActiveReservationSchema from "@app/Command/Infrastructure/Mongoose/Schema/ActiveReservationSchema";
import ActiveReservationNotFound from "@app/Command/Domain/Error/ActiveReservationNotFound";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class MongooseActiveReservationRepository implements ActiveReservationRepository {
  private readonly Model: mongoose.Model<IActiveReservation & mongoose.Document>;

  constructor(connection: mongoose.Connection,
              private readonly transformer: ActiveReservationMongooseTransformer) {
    this.Model = connection.model<IActiveReservation & mongoose.Document>("ActiveReservation",
      ActiveReservationSchema);
  }

  public async delete(reservation: ActiveReservation): Promise<void> {
    await this.Model.findOneAndDelete({id: reservation.getId().toString()});
  }

  public async getById(id: ReservationId): Promise<ActiveReservation> {
    const object = await this.Model.findOne({id: id.toString()});

    if (!object)
      throw new ActiveReservationNotFound();

    return this.transformer.domainInstanceFrom(object);
  }

  public async getByQueueNode(id: QueueNodeId): Promise<ActiveReservation[]> {
    const objects = await this.Model.find({queueNodeId: id.toString()});

    return objects.map(object => this.transformer.domainInstanceFrom(object));
  }

  public async save(reservation: ActiveReservation): Promise<void> {
    const instance = new this.Model(this.transformer.mongooseObjectFrom(reservation));
    await instance.save();
  }

}
