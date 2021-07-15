import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerRepository from "@app/Command/Domain/Service/QueueServerRepository";
import ChangeQueueServerStatusRequest from "@app/Command/Application/DataTransferObject/Request/ChangeQueueServerStatusRequest";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";

export default class ChangeQueueServerStatusService {
  constructor(
    private queueServerOperatorRepository: QueueServerOperatorRepository,
    private queueServerRepository: QueueServerRepository,
  ) {}

  public async execute(request: ChangeQueueServerStatusRequest): Promise<void> {
    const operatorId = QueueServerOperatorId.from(request.serverOperatorId);
    const operator = await this.queueServerOperatorRepository.getById(operatorId);
    const serverId = QueueServerId.from(request.serverId);
    const server = await this.queueServerRepository.getById(serverId);
    if (request.setAsActive) operator.activate(server);
    else operator.deactivate(server);
    await this.queueServerOperatorRepository.update(operator);
  }
}
