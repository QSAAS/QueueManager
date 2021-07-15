import ValueObject from "@app/Command/Domain/ValueObject/ValueObject";

export default class QueueNumber extends ValueObject {
  constructor(private queueNumber: string) {
    super();
  }

  static from(num: string): QueueNumber {
    return new QueueNumber(num);
  }

  // TODO: pass enough information to create to allow it to get next available number
  static create(): QueueNumber {
    return new QueueNumber("123");
  }

  public getQueueNumber(): string {
    return this.queueNumber;
  }

  public toString(): string {
    return this.queueNumber;
  }

  equals(other: this): boolean {
    return this.queueNumber === other.getQueueNumber();
  }
}
