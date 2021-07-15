import GenericTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/Interface/GenericTransformer";
import IMetadata from "@app/Command/Infrastructure/Mongoose/Types/IMetadata";
import Metadata from "@app/Command/Domain/ValueObject/Metadata";

// TODO: Implement
export default class MetadataMongooseTransformer implements GenericTransformer<IMetadata, Metadata> {
  domainInstanceFrom(object: IMetadata): Metadata {
    return new Metadata();
  }

  mongooseObjectFrom(instance: Metadata): IMetadata {
    return {};
  }

}
