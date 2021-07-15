import { Schema } from "mongoose";

const QueueServerSchema = new Schema({
  id: String,
  assignedQueueNodeIds: [String],
});

export default QueueServerSchema;
