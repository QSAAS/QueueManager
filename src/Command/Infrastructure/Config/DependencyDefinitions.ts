/* eslint-disable @typescript-eslint/no-shadow,max-classes-per-file */
import mongoose from "mongoose";
import {DependencyDefinitions} from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
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
import QueueAllocatorServiceListener from "@app/Command/Application/Service/QueueAllocatorServiceListener";
import SaveQueueServerOperatorService from "@app/Command/Application/Service/SaveQueueServerOperatorService";
import SaveQueueServerService from "@app/Command/Application/Service/SaveQueueServerService";
import ReservationController from "@app/Command/Presentation/Api/Controller/ReservationController";
import QueueServerController from "@app/Command/Presentation/Api/Controller/QueueServerController";

export enum DiEntry {
  MONGOOSE_CONNECTION,
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
}

const definitions: DependencyDefinitions<DiEntry> = {
  [DiEntry.MONGOOSE_CONNECTION]: async () => {
    const {DB_URL, DB_PORT, DB_NAME} = process.env;
    return mongoose.createConnection(`mongodb://${DB_URL}:${DB_PORT}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      poolSize: 100,
    });
  },
  [DiEntry.ActiveReservationRepository]: (container) =>
    new MongooseActiveReservationRepository(
      container.resolve(DiEntry.MONGOOSE_CONNECTION),
      container.resolve(DiEntry.ActiveReservationMongooseTransformer),
    ),
  [DiEntry.QueueServerOperatorRepository]: (container) =>
    new MongooseQueueServerOperatorRepository(
      container.resolve(DiEntry.MONGOOSE_CONNECTION),
      container.resolve(DiEntry.QueueServerOperatorMongooseTransformer)
    ),
  [DiEntry.QueueServerRepository]: (container) =>
    new MongooseQueueServerRepository(
      container.resolve(DiEntry.MONGOOSE_CONNECTION),
      container.resolve(DiEntry.QueueServerMongooseTransformer),
    ),
  [DiEntry.ActiveQueueServerMongooseTransformer]: (container) =>
    new ActiveQueueServerMongooseTransformer(
      container.resolve(DiEntry.InServiceRegistrationMongooseTransformer),
    ),
  [DiEntry.ActiveReservationMongooseTransformer]: (container) =>
    new ActiveReservationMongooseTransformer(
      container.resolve(DiEntry.MetadataMongooseTransformer),
    ),
  [DiEntry.InServiceRegistrationMongooseTransformer]: () =>
    new InServiceRegistrationMongooseTransformer(),
  [DiEntry.MetadataMongooseTransformer]: () =>
    new MetadataMongooseTransformer(),
  [DiEntry.QueueServerMongooseTransformer]: () =>
    new QueueServerMongooseTransformer(),
  [DiEntry.QueueServerOperatorMongooseTransformer]: (container) =>
    new QueueServerOperatorMongooseTransformer(
      container.resolve(DiEntry.ActiveQueueServerMongooseTransformer),
    ),
  [DiEntry.QueueServerAllocatorService]: (container) =>
    new ArbitraryQueueServerAllocatorService(
      container.resolve(DiEntry.ReservationQueue)
    ),
  [DiEntry.ReservationQueue]: (container) =>
    new FIFOReservationQueue(
      container.resolve(DiEntry.ActiveReservationRepository),
    ),
  [DiEntry.CancelReservationService]: (container) =>
    new CancelReservationService(
      new ClientCancelReservationService(
        container.resolve(DiEntry.QueueServerOperatorRepository),
        container.resolve(DiEntry.ActiveReservationRepository),
      )
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
    ),
  [DiEntry.SaveQueueServerOperatorService]: (container) =>
    new SaveQueueServerOperatorService(
      container.resolve(DiEntry.QueueServerOperatorRepository),
    ),
  [DiEntry.SaveQueueServerService]: (container) =>
    new SaveQueueServerService(
      container.resolve(DiEntry.QueueServerRepository),
    ),
  [DiEntry.ReservationController]: (container) =>
    new ReservationController(
      container.resolve(DiEntry.CancelReservationService),
    ),
  [DiEntry.QueueServerController]: (container) =>
    new QueueServerController(
      container.resolve(DiEntry.ChangeQueueServerStatusService),
      container.resolve(DiEntry.MarkQueueServerAsFreeService),
    ),
};

export default definitions;
