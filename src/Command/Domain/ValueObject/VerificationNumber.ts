import ValueObject from "@app/Command/Domain/ValueObject/ValueObject";

export default class VerificationNumber extends ValueObject {
  constructor(private verificationNumber: string) {
    super()
  }

  static from(num: string): VerificationNumber {
    return new VerificationNumber(num);
  }

  // TODO: Generate a readable verification number according to an algorithm
  static create(): VerificationNumber {
    return new VerificationNumber("123");
  }

  public getVerificationNumber(): string {
    return this.verificationNumber;
  }

  public toString(): string {
    return this.verificationNumber;
  }

  equals(other: this): boolean {
    return this.verificationNumber === other.getVerificationNumber();
  }

}
