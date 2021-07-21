import IMetadataEntry from "@app/Command/Infrastructure/Mongoose/Types/IMetadataEntry";

export default interface IMetadata {
  metadata: IMetadataEntry[],
}
