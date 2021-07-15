import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerOperatorSaved from "@app/Command/Domain/Event/QueueServerOperatorSaved";

export default class SaveQueueServerOperator {
  constructor(private queueServerOperatorRepository: QueueServerOperatorRepository) {
  }

  public async execute(event: QueueServerOperatorSaved): Promise<void> {
    const operator = event.getQueueServerOperator();
    await this.queueServerOperatorRepository.save(operator);
  }
}
