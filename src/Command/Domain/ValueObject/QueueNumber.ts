import ValueObject from "@app/Command/Domain/ValueObject/ValueObject";

export default class QueueNumber extends ValueObject {
  constructor(private queueNumber: string) {
    super()
  }

  public getQueueNumber(): string {
    return this.queueNumber;
  }

  equals(other: this): boolean {
    return this.queueNumber === other.getQueueNumber();
  }

}
