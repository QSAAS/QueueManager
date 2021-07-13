import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";

export default interface QueueServerOperatorRepository {
  getById(id: QueueServerOperatorId): Promise<QueueServerOperator>;
  getOperatorByReservation(id: ReservationId): Promise<QueueServerOperator>;
  getOperatorByQueueServer(id: QueueServerId): Promise<QueueServerOperator>;
  save(queueServerOperator: QueueServerOperator): Promise<void>;
  update(queueServerOperator: QueueServerOperator): Promise<void>;
}
