import ValueObject from "@app/Command/Domain/ValueObject/ValueObject";

export default class MetadataEntry extends ValueObject {
  constructor(private key: string,
              private value: string) {
    super();
  }

  public getKey(): string {
    return this.key;
  }

  public getValue(): string {
    return this.value;
  }

  equals(other: this): boolean {
    return this.key === other.key && this.value === other.value;
  }
}
