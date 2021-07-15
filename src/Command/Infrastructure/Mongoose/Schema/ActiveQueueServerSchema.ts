import { Schema } from "mongoose";

const ActiveQueueServerSchema = new Schema({
  id: String,
  reservation: Schema.Types.Mixed,
});

export default ActiveQueueServerSchema;
