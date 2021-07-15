import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import * as mongoose from "mongoose";
import IQueueServerOperator from "@app/Command/Infrastructure/Mongoose/Types/IQueueServerOperator";
import QueueServerOperatorMongooseTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/QueueServerOperatorMongooseTransformer";
import QueueServerOperatorSchema from "@app/Command/Infrastructure/Mongoose/Schema/QueueServerOperatorSchema";
import QueueServerOperatorNotFound from "@app/Command/Domain/Error/QueueServerOperatorNotFound";
import QueueServerOperatorNotFoundForServer from "@app/Command/Domain/Error/QueueServerOperatorNotFoundForServer";
import QueueServerOperatorNotFoundForReservation from "@app/Command/Domain/Error/QueueServerOperatorNotFoundForReservation";

export default class MongooseQueueServerOperatorRepository implements QueueServerOperatorRepository {
  private readonly Model: mongoose.Model<IQueueServerOperator & mongoose.Document>;

  constructor(connection: mongoose.Connection, private readonly transformer: QueueServerOperatorMongooseTransformer) {
    this.Model = connection.model<IQueueServerOperator & mongoose.Document>(
      "QueueServerOperator",
      QueueServerOperatorSchema,
    );
  }

  public async getById(id: QueueServerOperatorId): Promise<QueueServerOperator> {
    const object = await this.Model.findOne({ id: id.toString() });

    if (!object) throw new QueueServerOperatorNotFound();

    return this.transformer.domainInstanceFrom(object);
  }

  public async getOperatorByQueueServer(id: QueueServerId): Promise<QueueServerOperator> {
    // TODO: Everything should be tested, but this should be extra tested
    // The query is supposed to be: Get all queue server operators that contain this queueServerId as one of
    // the elements of assignedQueueServerIds
    const object = await this.Model.findOne({ assignedQueueServerIds: id.toString() });

    if (!object) throw new QueueServerOperatorNotFoundForServer();

    return this.transformer.domainInstanceFrom(object);
  }

  public async getOperatorByReservation(id: ReservationId): Promise<QueueServerOperator> {
    // TODO: Everything should be tested, but this should be extra tested
    // The query is supposed to be: Get all queue server operators that contain an activeQueueServer
    // that has a reservation with given id
    const object = await this.Model.findOne({
      activeQueueServers: {
        $elemMatch: {
          reservation: {
            id: id.toString(),
          },
        },
      },
    });

    if (!object) throw new QueueServerOperatorNotFoundForReservation();

    return this.transformer.domainInstanceFrom(object);
  }

  public async save(queueServerOperator: QueueServerOperator): Promise<void> {
    const instance = new this.Model(this.transformer.mongooseObjectFrom(queueServerOperator));
    await instance.save();
  }

  public async update(queueServerOperator: QueueServerOperator): Promise<void> {
    const instance = new this.Model(this.transformer.mongooseObjectFrom(queueServerOperator));
    await this.Model.findOneAndReplace({ id: instance.id }, instance);
  }
}
