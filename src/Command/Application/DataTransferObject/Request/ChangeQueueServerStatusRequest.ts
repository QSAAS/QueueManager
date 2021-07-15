export default class ChangeQueueServerStatusRequest {
  constructor(public serverOperatorId: string, public serverId: string, public setAsActive: boolean) {}
}
