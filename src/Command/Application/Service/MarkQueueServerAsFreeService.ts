import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";
import MarkQueueServerAsFreeRequest
  from "@app/Command/Application/DataTransferObject/Request/MarkQueueServerAsFreeRequest";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";

export default class MarkQueueServerAsFreeService {
  constructor(private queueServerOperatorRepository: QueueServerOperatorRepository,
              private queueServerRepository: QueueServerRepository) {}

  public async execute(request: MarkQueueServerAsFreeRequest): Promise<void> {
    const operatorId = new QueueServerOperatorId(request.queueServerOperatorId);
    const operator = await this.queueServerOperatorRepository.getById(operatorId);
    const serverId = new QueueServerId(request.queueServerId);
    const server = await this.queueServerRepository.getById(serverId);
    operator.markAsFree(server);
    await this.queueServerOperatorRepository.update(operator);
  }
}
