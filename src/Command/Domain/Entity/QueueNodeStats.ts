import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

export default class QueueNodeStats {
  constructor(private queueNodeId: QueueNodeId,
              private countServed: number,
              private totalTime: number) {
  }

  getQueueNodeId(): QueueNodeId {
    return this.queueNodeId;
  }

  getCountServed(): number {
    return this.countServed;
  }

  getTotalTime(): number {
    return this.totalTime;
  }

  public getAverageServingTime(): number {
    return this.totalTime/this.countServed;
  }
}
