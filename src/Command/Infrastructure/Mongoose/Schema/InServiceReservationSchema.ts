import { Schema } from "mongoose";

const InServiceReservationSchema = new Schema({
  id: String,
  serviceStartTime: String,
});

export default InServiceReservationSchema;
