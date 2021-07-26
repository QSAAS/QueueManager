import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import { DiEntry } from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import EventListener from "@app/Command/Application/EventListener/EventListener";



function getEventMap(container: DependencyInjectionContainer<DiEntry>): { [key: string]: EventListener<any>[] }{
  return {
    ReservationCreated: [
      container.resolve(DiEntry.QueueServerAllocatorService)
    ],
    QueueServerBecameFree: [
      container.resolve(DiEntry.QueueAllocatorBecameFreeServiceListener)
    ],
    QueueServerCreated: [
      container.resolve(DiEntry.SaveQueueServerService)
    ],
    QueueServerOperatorCreated: [
      container.resolve(DiEntry.SaveQueueServerOperatorService)
    ]
  }
}


export default getEventMap;
