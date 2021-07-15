import {Schema} from "mongoose";
import MetadataSchema from "@app/Command/Infrastructure/Mongoose/Schema/MetadataSchema";

const ActiveReservationSchema = new Schema({
  reservationId: String,
  clientId: String,
  queueNodeId: String,
  reservationTime: String,
  verificationNumber: String,
  numberInQueue: String,
  metadata: MetadataSchema,
});

export default ActiveReservationSchema;
