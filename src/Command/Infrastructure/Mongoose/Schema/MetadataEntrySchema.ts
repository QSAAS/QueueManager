import { Schema } from "mongoose";

const MetadataEntrySchema = new Schema({
  key: String,
  value: String,
});

export default MetadataEntrySchema;
