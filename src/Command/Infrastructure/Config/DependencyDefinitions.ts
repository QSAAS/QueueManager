/* eslint-disable @typescript-eslint/no-shadow,max-classes-per-file */
import mongoose from "mongoose";
import { DependencyDefinitions } from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import MongooseActiveReservationRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";
import MongooseQueueServerOperatorRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerOperatorRepository";
import QueueServerOperatorMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/QueueServerOperatorMongooseTransformer";
import MongooseQueueServerRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerRepository";
import ActiveQueueServerMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/ActiveQueueServerMongooseTransformer";
import ActiveReservationMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/ActiveReservationMongooseTransformer";
import InServiceRegistrationMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/InServiceRegistrationMongooseTransformer";
import MetadataMongooseTransformer from "@app/Command/Infrastructure/Mongoose/Transformer/MetadataMongooseTransformer";
import QueueServerMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/QueueServerMongooseTransformer";
import ArbitraryQueueServerAllocatorService
  from "@app/Command/Infrastructure/Service/ArbitraryQueueServerAllocatorService";
import FIFOReservationQueue from "@app/Command/Infrastructure/Service/FIFOReservationQueue";
import CancelReservationService from "@app/Command/Application/Service/CancelReservationService";
import ClientCancelReservationService from "@app/Command/Domain/Service/ClientCancelReservationService";
import ChangeQueueServerStatusService from "@app/Command/Application/Service/ChangeQueueServerStatusService";
import MarkQueueServerAsFreeService from "@app/Command/Application/Service/MarkQueueServerAsFreeService";
import QueueAllocatorServiceListener from "@app/Command/Application/EventListener/QueueAllocatorServiceListener";
import SaveQueueServerOperatorService from "@app/Command/Application/EventListener/SaveQueueServerOperatorService";
import SaveQueueServerService from "@app/Command/Application/EventListener/SaveQueueServerService";
import ReservationController from "@app/Command/Presentation/Api/Controller/ReservationController";
import QueueServerController from "@app/Command/Presentation/Api/Controller/QueueServerController";
import MetadataEntryMongooseTransformer
  from "@app/Command/Infrastructure/Mongoose/Transformer/MetadataEntryMongooseTransformer";
import EventHandler from "@app/Command/Infrastructure/Service/EventHandler";
import DummyEventBus from "@app/Command/Infrastructure/Service/DummyEventBus";
import RabbitMQEventBus from "@app/Command/Infrastructure/Service/RabbitMQEventBus";
import QueueAllocatorBecameFreeServiceListener
  from "@app/Command/Application/EventListener/QueueAllocatorBecameFreeServiceListener";
import getEventMap from "@app/Command/Infrastructure/Service/EventHandler/EventMap";
import ApplyNewAuthorizationRule from "@app/Command/Application/EventListener/ApplyNewAuthorizationRule";

export enum DiEntry {
  MONGOOSE_CONNECTION,
  RABBIT_MQ_URL,
  ActiveReservationRepository,
  QueueServerOperatorRepository,
  QueueServerRepository,
  ActiveQueueServerMongooseTransformer,
  ActiveReservationMongooseTransformer,
  InServiceRegistrationMongooseTransformer,
  MetadataMongooseTransformer,
  QueueServerMongooseTransformer,
  QueueServerOperatorMongooseTransformer,
  QueueServerAllocatorService,
  ReservationQueue,
  CancelReservationService,
  ChangeQueueServerStatusService,
  MarkQueueServerAsFreeService,
  QueueAllocatorServiceListener,
  SaveQueueServerOperatorService,
  SaveQueueServerService,
  ReservationController,
  QueueServerController,
  MetadataEntryMongooseTransformer,
  EventHandler,
  EventBus,
  QueueAllocatorBecameFreeServiceListener,
  ApplyNewAuthorizationRule,
}

const definitions: DependencyDefinitions<DiEntry> = {
  [DiEntry.MONGOOSE_CONNECTION]: async () => {
    const { DB_URL, DB_PORT, DB_NAME } = process.env;
    return mongoose.createConnection(`mongodb://${DB_URL}:${DB_PORT}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      poolSize: 100,
    });
  },
  [DiEntry.RABBIT_MQ_URL]: () => process.env.RABBIT_MQ_URL,
  [DiEntry.ActiveReservationRepository]: (container) =>
    new MongooseActiveReservationRepository(
      container.resolve(DiEntry.MONGOOSE_CONNECTION),
      container.resolve(DiEntry.ActiveReservationMongooseTransformer),
    ),
  [DiEntry.QueueServerOperatorRepository]: (container) =>
    new MongooseQueueServerOperatorRepository(
      container.resolve(DiEntry.MONGOOSE_CONNECTION),
      container.resolve(DiEntry.QueueServerOperatorMongooseTransformer),
    ),
  [DiEntry.QueueServerRepository]: (container) =>
    new MongooseQueueServerRepository(
      container.resolve(DiEntry.MONGOOSE_CONNECTION),
      container.resolve(DiEntry.QueueServerMongooseTransformer),
    ),
  [DiEntry.ActiveQueueServerMongooseTransformer]: (container) =>
    new ActiveQueueServerMongooseTransformer(container.resolve(DiEntry.InServiceRegistrationMongooseTransformer)),
  [DiEntry.ActiveReservationMongooseTransformer]: (container) =>
    new ActiveReservationMongooseTransformer(container.resolve(DiEntry.MetadataMongooseTransformer)),
  [DiEntry.InServiceRegistrationMongooseTransformer]: () => new InServiceRegistrationMongooseTransformer(),
  [DiEntry.MetadataMongooseTransformer]: (container) =>
    new MetadataMongooseTransformer(container.resolve(DiEntry.MetadataEntryMongooseTransformer)),
  [DiEntry.QueueServerMongooseTransformer]: () => new QueueServerMongooseTransformer(),
  [DiEntry.QueueServerOperatorMongooseTransformer]: (container) =>
    new QueueServerOperatorMongooseTransformer(container.resolve(DiEntry.ActiveQueueServerMongooseTransformer)),
  [DiEntry.QueueServerAllocatorService]: (container) =>
    new ArbitraryQueueServerAllocatorService(container.resolve(DiEntry.ReservationQueue)),
  [DiEntry.ReservationQueue]: (container) =>
    new FIFOReservationQueue(container.resolve(DiEntry.ActiveReservationRepository)),
  [DiEntry.CancelReservationService]: (container) =>
    new CancelReservationService(
      new ClientCancelReservationService(
        container.resolve(DiEntry.QueueServerOperatorRepository),
        container.resolve(DiEntry.ActiveReservationRepository),
      ),
    ),
  [DiEntry.ChangeQueueServerStatusService]: (container) =>
    new ChangeQueueServerStatusService(
      container.resolve(DiEntry.QueueServerOperatorRepository),
      container.resolve(DiEntry.QueueServerRepository),
    ),
  [DiEntry.MarkQueueServerAsFreeService]: (container) =>
    new MarkQueueServerAsFreeService(
      container.resolve(DiEntry.QueueServerOperatorRepository),
      container.resolve(DiEntry.QueueServerRepository),
    ),
  [DiEntry.QueueAllocatorServiceListener]: (container) =>
    new QueueAllocatorServiceListener(
      container.resolve(DiEntry.QueueServerOperatorRepository),
      container.resolve(DiEntry.QueueServerAllocatorService),
      container.resolve(DiEntry.QueueServerRepository),
      container.resolve(DiEntry.ActiveReservationRepository),
    ),
  [DiEntry.SaveQueueServerOperatorService]: (container) =>
    new SaveQueueServerOperatorService(container.resolve(DiEntry.QueueServerOperatorRepository)),
  [DiEntry.SaveQueueServerService]: (container) =>
    new SaveQueueServerService(container.resolve(DiEntry.QueueServerRepository)),
  [DiEntry.ReservationController]: (container) =>
    new ReservationController(container.resolve(DiEntry.CancelReservationService)),
  [DiEntry.QueueServerController]: (container) =>
    new QueueServerController(
      container.resolve(DiEntry.ChangeQueueServerStatusService),
      container.resolve(DiEntry.MarkQueueServerAsFreeService),
    ),
  [DiEntry.MetadataEntryMongooseTransformer]: () => new MetadataEntryMongooseTransformer(),
  [DiEntry.EventBus]: async (container) => {
    if (process.env.ENV === "testing") {
      return new DummyEventBus();
    }
    const bus = new RabbitMQEventBus(container.resolve(DiEntry.RABBIT_MQ_URL));
    try {
      await bus.waitForConnection();
    } catch (e) {
      console.error("EventBus is not available (Timeout)");
      return new DummyEventBus();
    }
    return bus;
  },
  [DiEntry.EventHandler]: async (container) => new EventHandler(container.resolve(DiEntry.EventBus), await getEventMap(container)),
  [DiEntry.QueueAllocatorBecameFreeServiceListener]: (container) => new QueueAllocatorBecameFreeServiceListener(
    container.resolve(DiEntry.QueueServerOperatorRepository),
    container.resolve(DiEntry.QueueServerAllocatorService),
    container.resolve(DiEntry.QueueServerRepository),
    container.resolve(DiEntry.ActiveReservationRepository),
  ),
  [DiEntry.ApplyNewAuthorizationRule]: (container) => new ApplyNewAuthorizationRule(
    container.resolve(DiEntry.QueueServerOperatorRepository)
  )
}
;

export default definitions;
