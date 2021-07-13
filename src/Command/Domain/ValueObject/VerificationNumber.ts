import ValueObject from "@app/Command/Domain/ValueObject/ValueObject";

export default class VerificationNumber extends ValueObject {
  constructor(private verificationNumber: string) {
    super()
  }

  public getVerificationNumber(): string {
    return this.verificationNumber;
  }

  equals(other: this): boolean {
    return this.verificationNumber === other.getVerificationNumber();
  }

}
