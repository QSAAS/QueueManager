import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IMetadataEntry from "@app/Command/Infrastructure/Mongoose/Types/IMetadataEntry";
import MetadataEntry from "@app/Command/Domain/ValueObject/MetadataEntry";

export default class MetadataEntryMongooseTransformer implements GenericTransformer<IMetadataEntry, MetadataEntry> {
  domainInstanceFrom(object: IMetadataEntry): MetadataEntry {
    return new MetadataEntry(object.key, object.value);
  }

  mongooseObjectFrom(instance: MetadataEntry): IMetadataEntry {
    return {
      key: instance.getKey(),
      value: instance.getValue()
    };
  }
}
