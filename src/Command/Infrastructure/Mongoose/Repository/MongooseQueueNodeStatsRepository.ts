import QueueNodeStatsRepository from "@app/Command/Domain/Service/QueueNodeStatsRepository";
import mongoose from "mongoose";
import ActiveReservationSchema from "@app/Command/Infrastructure/Mongoose/Schema/ActiveReservationSchema";
import IQueueNodeStats from "@app/Command/Infrastructure/Mongoose/Types/IQueueNodeStats";
import QueueNodeStatsTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/QueueNodeStatsTransformer";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueNodeStats from "@app/Command/Domain/Entity/QueueNodeStats";
import StatsNotFoundForQueueNode from "@app/Command/Domain/Error/StatsNotFoundForQueueNode";

export default class MongooseQueueNodeStatsRepository implements QueueNodeStatsRepository {
  private readonly Model: mongoose.Model<IQueueNodeStats & mongoose.Document>;

  constructor(connection: mongoose.Connection, private readonly transformer: QueueNodeStatsTransformer) {
    this.Model = connection.model<IQueueNodeStats & mongoose.Document>("QueueNodeStats", ActiveReservationSchema);
  }

  public async addStat(queueNodeId: QueueNodeId, countServed: number, timeTaken: number): Promise<void> {
      await this.Model
        .findOneAndUpdate({queueNodeId: queueNodeId.toString()}, {
          $inc: {
            "countServed": countServed,
            "timeTaken": timeTaken,
          }
        });
  }

  public async getByQueueNodeId(queueNodeId: QueueNodeId): Promise<QueueNodeStats> {
    const object = await this.Model.findOne({queueNodeId: queueNodeId.toString()});
    if (!object)
      throw new StatsNotFoundForQueueNode();
    return this.transformer.domainInstanceFrom(object);
  }
}
