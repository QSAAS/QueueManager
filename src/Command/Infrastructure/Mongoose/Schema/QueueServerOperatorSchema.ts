import { Schema } from "mongoose";
import ActiveQueueServerSchema from "@app/Command/Infrastructure/Mongoose/Schema/ActiveQueueServerSchema";

const QueueServerOperatorSchema = new Schema({
  id: String,
  assignedQueueServerIds: [String],
  assignedQueueNodeIds: [String],
  activeQueueServers: [ActiveQueueServerSchema],
});

export default QueueServerOperatorSchema;
