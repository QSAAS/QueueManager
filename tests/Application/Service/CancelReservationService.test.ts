import request from "supertest";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import {Express} from "express";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import createApp from "@app/app";
import MongooseActiveReservationRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";

let app: Express;
let container: DependencyInjectionContainer<DiEntry>;
let repo:MongooseActiveReservationRepository;

beforeAll(async () => {
  container = await getDependencyContainer();
  app = await createApp();
});

beforeEach(async () => {
  repo = container.resolve<MongooseActiveReservationRepository>(DiEntry.ActiveReservationRepository);
  await repo.getModel().deleteMany({});
});

describe("manager/reservation", () => {
  describe("POST /cancel", () => {
    const PATH = "/manager/reservation/cancel";
    it("Should cancel a valid active reservation and return 200", async () => {
      await repo.getModel().create({
        reservationId: "::rId::",
        clientId: "::cId::",
        queueNodeId: "::qId::",
        reservationTime: new Date(),
        verificationNumber: "::123::",
        numberInQueue: "::123::",
        metadata: {}
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
      const reservations = await repo.getModel().find({});
      // deletes the reservation
      expect(reservations.length === 0);
    });
  })
});
