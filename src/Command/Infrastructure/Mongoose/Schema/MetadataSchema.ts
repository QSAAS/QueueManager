import { Schema } from "mongoose";
import MetadataEntrySchema from "@app/Command/Infrastructure/Mongoose/Schema/MetadataEntrySchema";

const MetadataSchema = new Schema({
  metadata: [MetadataEntrySchema],
});

export default MetadataSchema;
