import {Schema} from "mongoose";

const QueueNodeStatsSchema = new Schema({
  queueNodeId: String,
  countServed: Number,
  totalTime: Number,
});

export default QueueNodeStatsSchema;
