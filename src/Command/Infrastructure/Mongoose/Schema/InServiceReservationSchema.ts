import { Schema } from "mongoose";

const InServiceReservationSchema = new Schema({
  id: String,
  serviceStartTime: Number,
});

export default InServiceReservationSchema;
