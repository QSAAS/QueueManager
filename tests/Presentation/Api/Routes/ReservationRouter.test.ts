import request from "supertest";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import { DiEntry } from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import { Express } from "express";
import { getDependencyContainer } from "@app/Command/Presentation/Api/Routes/Router";
import createApp from "@app/app";
import MongooseActiveReservationRepository from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";
import MongooseQueueServerOperatorRepository from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerOperatorRepository";

let app: Express;
let container: DependencyInjectionContainer<DiEntry>;
let activeReservationRepository: MongooseActiveReservationRepository;
let queueServerOperatorRepository: MongooseQueueServerOperatorRepository;

beforeAll(async () => {
  container = await getDependencyContainer();
  app = await createApp();
});

beforeEach(async () => {
  activeReservationRepository = container.resolve<MongooseActiveReservationRepository>(
    DiEntry.ActiveReservationRepository,
  );
  queueServerOperatorRepository = container.resolve<MongooseQueueServerOperatorRepository>(
    DiEntry.QueueServerOperatorRepository,
  );
  await activeReservationRepository.getModel().deleteMany({});
  await queueServerOperatorRepository.getModel().deleteMany({});
});

describe("manager/reservation", () => {
  describe("POST /cancel", () => {
    const PATH = "/manager/reservation/cancel";
    it("Should cancel a valid active reservation and return 200", async () => {
      await activeReservationRepository.getModel().create({
        reservationId: "::rId::",
        clientId: "::cId::",
        queueNodeId: "::qId::",
        reservationTime: new Date(),
        verificationNumber: "::123::",
        numberInQueue: "::123::",
        metadata: {
          metadata: []
        },
      });

      // 2 operators
      // first one with 2 servers, 1 is busy, 1 is free
      // second one with 2 servers, 1 is busy, 1 is free
      // no server has the requested reservation
      await queueServerOperatorRepository.getModel().create({
        id: "::qsId::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId2::",
            reservation: {
              id: "::rId::2",
              serviceStartTime: "1",
            },
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId::",
            reservation: null,
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId2::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId3::",
            reservation: null,
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId2::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId3::",
            reservation: {
              id: "::otherRID::",
              serviceStartTime: "1",
            },
          },
        ],
      });

      // returns 200
      const response = await request(app)
        .post(PATH)
        .send({
          reservationId: "::rId::",
          clientId: "::cId::",
        })
        .set("Accept", "application/json")
        .expect(200);
      console.log(response.body);
      const reservations = await activeReservationRepository.getModel().find({});
      // deletes the reservation
      expect(reservations.length === 0);
    });

    it("Should return 400 on missing clientId", async () => {
      await request(app)
        .post(PATH)
        .send({
          reservationId: "::rId::",
        })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("Should return 400 on missing reservationId", async () => {
      await request(app)
        .post(PATH)
        .send({
          clientId: "::cId::",
        })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("Should return 403 on a reservation for other clientId and not delete it", async () => {
      const doc = await activeReservationRepository.getModel().create({
        reservationId: "::rId::",
        clientId: "::cId::",
        queueNodeId: "::qId::",
        reservationTime: new Date(),
        verificationNumber: "::123::",
        numberInQueue: "::123::",
        metadata: {
          metadata: []
        },
      });

      await request(app)
        .post(PATH)
        .send({
          reservationId: "::rId::",
          clientId: "::otherCId::",
        })
        .set("Accept", "application/json")
        .expect(403);

      const docInDb = await activeReservationRepository.getModel().findOne({
        reservationId: doc.reservationId,
      });
      expect(docInDb).toBeDefined();
    });

    it("Should return 409 when reservation is not in active reservations", async () => {
      await activeReservationRepository.getModel().create({
        reservationId: "::rId::",
        clientId: "::cId::",
        queueNodeId: "::qId::",
        reservationTime: new Date(),
        verificationNumber: "::123::",
        numberInQueue: "::123::",
        metadata: {
          metadata: []
        },
      });

      await request(app)
        .post(PATH)
        .send({
          reservationId: "::otherRId::",
          clientId: "::cId::",
        })
        .set("Accept", "application/json")
        .expect(409);
    });

    it("Should return 409 when reservation is in service and not delete it", async () => {
      const doc = await activeReservationRepository.getModel().create({
        reservationId: "::rId::",
        clientId: "::cId::",
        queueNodeId: "::qId::",
        reservationTime: new Date(),
        verificationNumber: "::123::",
        numberInQueue: "::123::",
        metadata: {
          metadata: []
        },
      });

      // 2 operators
      // first one with 3 servers, 2 are busy (one of the busy has the requested reservation), 1 is free
      // second one with 2 servers, 1 is busy, 1 is free
      await queueServerOperatorRepository.getModel().create({
        id: "::qsId::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId::",
            reservation: {
              id: "::rId::",
              serviceStartTime: "1",
            },
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId2::",
            reservation: {
              id: "::rId::2",
              serviceStartTime: "1",
            },
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId::",
            reservation: null,
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId2::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId3::",
            reservation: null,
          },
        ],
      });

      await queueServerOperatorRepository.getModel().create({
        id: "::qsId2::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [
          {
            id: "::aqsId3::",
            reservation: {
              id: "::otherRID::",
              serviceStartTime: "1",
            },
          },
        ],
      });

      await request(app)
        .post(PATH)
        .send({
          reservationId: "::rId::",
          clientId: "::cId::",
        })
        .set("Accept", "application/json")
        .expect(409);

      const docInDB = await activeReservationRepository.getModel().findOne({ reservationId: doc.reservationId });
      expect(docInDB).toBeDefined();
    });
  });
});
