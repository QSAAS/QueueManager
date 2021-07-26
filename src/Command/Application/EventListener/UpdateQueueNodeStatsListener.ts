import EventListener from "@app/Command/Application/EventListener/EventListener";
import { IncomingEvent } from "@app/Command/Domain/Service/EventBus";
import QueueNodeStatsRepository from "@app/Command/Domain/Service/QueueNodeStatsRepository";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";

interface ReservationCompleted extends IncomingEvent {
  data: {
    reservationId: string,
    queueNodeId: string,
    serviceStartTime: Date,
    serviceEndTime: Date,
  };
}

export default class UpdateQueueNodeStatsListener implements EventListener<ReservationCompleted> {
  constructor(private queueNodeStatsRepository: QueueNodeStatsRepository) {
  }

  async execute(event: ReservationCompleted): Promise<void> {
    console.log("GOT EVENT", event, event.data);
    const {queueNodeId, serviceStartTime, serviceEndTime} = event.data;
    const timeTaken = serviceEndTime.getTime() - serviceStartTime.getTime();
    await this.queueNodeStatsRepository.addStat(QueueNodeId.from(queueNodeId), 1, timeTaken);
  }
}
