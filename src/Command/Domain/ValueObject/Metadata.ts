import ValueObject from "@app/Command/Domain/ValueObject/ValueObject";
import MetadataEntry from "@app/Command/Domain/ValueObject/MetadataEntry";

export default class Metadata extends ValueObject {
  constructor(private metadata: MetadataEntry[]) {
    super();
  }

  public getMetadata(): MetadataEntry[] {
    return this.metadata;
  }

  public getLength(): number {
    return this.metadata.length;
  }

  equals(other: this): boolean {
    if (other.getLength() !== this.getLength())
      return false;
    for (let i = 0; i < other.getLength(); ++i)
      if (!other.getMetadata()[i].equals(this.getMetadata()[i]))
        return false;
    return true;
  }
}
