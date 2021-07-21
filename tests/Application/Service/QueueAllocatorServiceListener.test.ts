import MongooseQueueServerOperatorRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerOperatorRepository";
import MongooseActiveReservationRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";
import MongooseQueueServerRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerRepository";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import ActiveReservation from "@app/Command/Domain/Entity/ActiveReservation";
import Metadata from "@app/Command/Domain/ValueObject/Metadata";
import ReservationId from "@app/Command/Domain/ValueObject/ReservationId";
import QueueNodeId from "@app/Command/Domain/ValueObject/QueueNodeId";
import QueueNumber from "@app/Command/Domain/ValueObject/QueueNumber";
import VerificationNumber from "@app/Command/Domain/ValueObject/VerificationNumber";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueAllocatorServiceListener from "@app/Command/Application/Service/QueueAllocatorServiceListener";
import NewReservationCreated from "@app/Command/Domain/Event/NewReservationCreated";

let container: DependencyInjectionContainer<DiEntry>;
let queueServerOperatorRepository: MongooseQueueServerOperatorRepository;
let queueAllocatorServiceListener: QueueAllocatorServiceListener;
let queueServerRepository: MongooseQueueServerRepository;
let activeReservationRepository: MongooseActiveReservationRepository;

beforeAll(async () => {
  container = await getDependencyContainer();
});

beforeEach(async () => {
  queueServerOperatorRepository = container.resolve<MongooseQueueServerOperatorRepository>(DiEntry.QueueServerOperatorRepository);
  queueAllocatorServiceListener = container.resolve<QueueAllocatorServiceListener>(DiEntry.QueueAllocatorServiceListener);
  queueServerRepository = container.resolve<MongooseQueueServerRepository>(DiEntry.QueueServerRepository);
  activeReservationRepository = container.resolve<MongooseActiveReservationRepository>(DiEntry.ActiveReservationRepository);
  await queueServerOperatorRepository.getModel().deleteMany({});
  await queueServerRepository.getModel().deleteMany({});
  await activeReservationRepository.getModel().deleteMany({});
});

describe("QueueAllocatorServiceListener", () => {
  describe("New active reservation arrived", () => {
    it("Should allocate to a queue server if one is available", async () => {
      const activeReservation = new ActiveReservation(
        ReservationId.create(),
        ClientId.create(),
        QueueNodeId.create(),
        new Date(),
        VerificationNumber.create(),
        QueueNumber.create(),
        new Metadata(),
      );

      await activeReservationRepository
        .save(activeReservation);

      const server = await queueServerRepository
        .getModel()
        .create({
          id: QueueServerId.create().toString(),
          assignedQueueNodeIds: [activeReservation.getQueueNodeId()],
        });

      const operator = await queueServerOperatorRepository
        .getModel()
        .create({
          id: QueueServerOperatorId.create().toString(),
          assignedQueueServerIds: [server.id],
          assignedQueueNodeIds: [activeReservation.getQueueNodeId().toString()],
          activeQueueServers: [
            {
              id: server.id,
              reservation: null,
            }
          ]
        });

      await queueAllocatorServiceListener.executeBecauseNewReservationCreated(
        new NewReservationCreated(activeReservation)
      );

      const reservationObject = await activeReservationRepository.getModel().findOne({reservationId: activeReservation.getId().toString()});
      expect(reservationObject).toBeNull();

      const operatorObject = await queueServerOperatorRepository.getModel().findOne({id: operator.id});
      expect(operatorObject?.activeQueueServers.find(s => s.id === server.id)?.reservation?.id).toEqual(activeReservation.getId().toString());
    });

    it("Should do nothing if there is server is busy", async () => {
      const activeReservation = new ActiveReservation(
        ReservationId.create(),
        ClientId.create(),
        QueueNodeId.create(),
        new Date(),
        VerificationNumber.create(),
        QueueNumber.create(),
        new Metadata(),
      );

      await activeReservationRepository
        .save(activeReservation);

      const server = await queueServerRepository
        .getModel()
        .create({
          id: QueueServerId.create().toString(),
          assignedQueueNodeIds: [activeReservation.getQueueNodeId()],
        });

      await queueServerOperatorRepository
        .getModel()
        .create({
          id: QueueServerOperatorId.create().toString(),
          assignedQueueServerIds: [server.id],
          assignedQueueNodeIds: [activeReservation.getQueueNodeId().toString()],
          activeQueueServers: [
            {
              id: server.id,
              reservation: {
                id: "id",
                serviceStartTime: 1,
              },
            }
          ]
        });

      await queueAllocatorServiceListener.executeBecauseNewReservationCreated(
        new NewReservationCreated(activeReservation)
      );

      const reservationObject = await activeReservationRepository.getModel().findOne({reservationId: activeReservation.getId().toString()});
      expect(reservationObject).not.toBeNull();
    });

    it("Should do nothing if there is server is not active", async () => {
      const activeReservation = new ActiveReservation(
        ReservationId.create(),
        ClientId.create(),
        QueueNodeId.create(),
        new Date(),
        VerificationNumber.create(),
        QueueNumber.create(),
        new Metadata(),
      );

      await activeReservationRepository
        .save(activeReservation);

      const server = await queueServerRepository
        .getModel()
        .create({
          id: QueueServerId.create().toString(),
          assignedQueueNodeIds: [activeReservation.getQueueNodeId()],
        });

      await queueServerOperatorRepository
        .getModel()
        .create({
          id: QueueServerOperatorId.create().toString(),
          assignedQueueServerIds: [server.id],
          assignedQueueNodeIds: [activeReservation.getQueueNodeId().toString()],
          activeQueueServers: []
        });

      await queueAllocatorServiceListener.executeBecauseNewReservationCreated(
        new NewReservationCreated(activeReservation)
      );

      const reservationObject = await activeReservationRepository.getModel().findOne({reservationId: activeReservation.getId().toString()});
      expect(reservationObject).not.toBeNull();
    });

  });

  describe("Active queue server became free", () => {

  });
});
