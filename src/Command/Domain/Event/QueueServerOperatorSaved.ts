import DomainEvent from "@app/Command/Domain/Event/DomainEvent";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";

export default class QueueServerOperatorSaved extends DomainEvent {
  constructor(private operator: QueueServerOperator) {
    super();
  }

  public getQueueServerOperator(): QueueServerOperator {
    return this.operator;
  }
}
