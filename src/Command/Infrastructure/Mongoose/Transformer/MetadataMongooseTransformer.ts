import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IMetadata from "@app/Command/Infrastructure/Mongoose/Types/IMetadata";
import Metadata from "@app/Command/Domain/ValueObject/Metadata";
import MetadataEntryMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/MetadataEntryMongooseTransformer";

export default class MetadataMongooseTransformer implements GenericTransformer<IMetadata, Metadata> {
  constructor (private metadataEntryMongooseTransformer: MetadataEntryMongooseTransformer) {
  }

  domainInstanceFrom(object: IMetadata): Metadata {
    return new Metadata(object.metadata.map(d => this.metadataEntryMongooseTransformer.domainInstanceFrom(d)));
  }

  mongooseObjectFrom(instance: Metadata): IMetadata {
    return {
      metadata: instance.getMetadata().map(d => this.metadataEntryMongooseTransformer.mongooseObjectFrom(d))
    };
  }
}
