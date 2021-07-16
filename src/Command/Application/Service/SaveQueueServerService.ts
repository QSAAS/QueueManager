import QueueServerSaved from "@app/Command/Domain/Event/QueueServerSaved";
import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";

export default class SaveQueueServerService {
  constructor(private queueServerRepository: QueueServerRepository) {}

  public async execute(event: QueueServerSaved): Promise<void> {
    const server = event.getQueueServer();
    await this.queueServerRepository.save(server);
  }
}
