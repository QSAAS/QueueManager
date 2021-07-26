import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import EventListener from "@app/Command/Application/EventListener/EventListener";
import { IncomingEvent } from "@app/Command/Domain/Service/EventBus";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";

interface AuthorizationRuleCreated extends IncomingEvent {
  data: {
    authorizationRule: {
      organizationEmployeeId: { id: string },
      permission: {
        resourceId: { id: string } | null,
        resourceType: string,
        action: string
      },
    }
  }
}

export default class ApplyNewAuthorizationRule implements EventListener<AuthorizationRuleCreated> {
  constructor(private queueServerOperatorRepository: QueueServerOperatorRepository) {
  }

  public async execute(event: AuthorizationRuleCreated): Promise<void> {
    const data = event.data.authorizationRule;
    if (data.permission.action === "MANAGE") {
      const operator = await this.queueServerOperatorRepository.getById(QueueServerOperatorId.from(data.organizationEmployeeId.id));
      if (data.permission.resourceType === "QUEUE_NODE") {
        const id = QueueNodeId.from(data.permission.resourceId?.id || "");
        operator.addAssignedQueueNodeId(id);
      }
      if (data.permission.resourceType === "QUEUE_SERVER") {
        const id = QueueServerId.from(data.permission.resourceId?.id || "");
        operator.addAssignedQueueServerId(id);
      }
      await this.queueServerOperatorRepository.update(operator);
    }
  }
}
