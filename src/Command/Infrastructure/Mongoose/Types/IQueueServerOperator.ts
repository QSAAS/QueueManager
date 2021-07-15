import IActiveQueueServer from "@app/Command/Infrastructure/Mongoose/Types/IActiveQueueServer";

export default interface IQueueServerOperator {
  id: string,
  assignedQueueServerIds: string[],
  assignedQueueNodeIds: string[],
  activeQueueServers: IActiveQueueServer[],
}
