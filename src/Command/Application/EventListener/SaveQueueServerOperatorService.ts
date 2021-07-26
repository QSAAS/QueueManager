import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import EventListener from "@app/Command/Application/EventListener/EventListener";
import { IncomingEvent } from "@app/Command/Domain/Service/EventBus";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";

interface QueueServerOperatorCreated extends IncomingEvent {
  data: {
    employee: {
      id: { id: string },
      organizationId: { id: string },
      name: string,
      passwordHash: {passwordHash: string},
      username: {username: string}
    }
  }
}

export default class SaveQueueServerOperatorService implements EventListener<QueueServerOperatorCreated>{
  constructor(private queueServerOperatorRepository: QueueServerOperatorRepository) {}

  public async execute(event: QueueServerOperatorCreated): Promise<void> {
    const data = event.data.employee;
    const operator = new QueueServerOperator(
      QueueServerOperatorId.from(data.id.id),
      [],
      [],
      []
    );
    await this.queueServerOperatorRepository.save(operator);
  }
}
