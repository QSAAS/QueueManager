import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import * as mongoose from "mongoose";
import IQueueServer from "@app/Command/Infrastructure/Mongoose/Types/IQueueServer";
import QueueServerMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/QueueServerMongooseTransformer";
import QueueServerSchema from "@app/Command/Infrastructure/Mongoose/Schema/QueueServerSchema";
import QueueServerNotFound from "@app/Command/Domain/Error/QueueServerNotFound";

export default class MongooseQueueServerRepository implements QueueServerRepository {
  private readonly Model: mongoose.Model<IQueueServer & mongoose.Document>;

  constructor(connection: mongoose.Connection,
              private transformer: QueueServerMongooseTransformer) {
    this.Model = connection.model<IQueueServer & mongoose.Document>("QueueServer",
      QueueServerSchema);
  }

  public async getById(id: QueueServerId): Promise<QueueServer> {
    const object = await this.Model.findOne({id: id.toString()});

    if (!object)
      throw new QueueServerNotFound();

    return this.transformer.domainInstanceFrom(object);
  }

  public async getByQueueNode(queueNodeId: QueueNodeId): Promise<QueueServer[]> {
    // TODO: Everything should be tested, but this should be extra tested
    // The query is supposed to be: Get all queue servers that contain queueNodeId as one of
    // the elements of assignedQueueNodeIds
    const objects = await this.Model.find({assignedQueueNodeIds: queueNodeId.toString()});
    return objects.map(object => this.transformer.domainInstanceFrom(object));
  }

  public async save(queueServer: QueueServer): Promise<void> {
    const instance = new this.Model(this.transformer.mongooseObjectFrom(queueServer));
    await instance.save();
  }
}
