import { Schema } from "mongoose";

const InServiceReservationSchema = new Schema({
  id: String,
  serviceStartTime: Number,
  queueNodeId: String,
});

export default InServiceReservationSchema;
