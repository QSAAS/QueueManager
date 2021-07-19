import {Express} from "express";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import MongooseQueueServerOperatorRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerOperatorRepository";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import createApp from "@app/app";
import MongooseQueueServerRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerRepository";
import request from "supertest";

let app: Express;
let container: DependencyInjectionContainer<DiEntry>;
let queueServerRepository: MongooseQueueServerRepository;
let queueServerOperatorRepository: MongooseQueueServerOperatorRepository;

beforeAll(async () => {
  container = await getDependencyContainer();
  app = await createApp();
});

beforeEach(async () => {
  queueServerRepository = container.resolve<MongooseQueueServerRepository>(DiEntry.QueueServerRepository);
  queueServerOperatorRepository = container.resolve<MongooseQueueServerOperatorRepository>(DiEntry.QueueServerOperatorRepository);
  await queueServerRepository.getModel().deleteMany({});
  await queueServerOperatorRepository.getModel().deleteMany({});
});

describe("/manager/server", () => {
  describe("/change-status", () => {
    const PATH = "/manager/server/change-status";

    it("Should activate an inactive server", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(200);

      const object = await queueServerOperatorRepository.getModel().findOne({
        id: "::queueServerOperatorId::",
      });
      expect(object?.activeQueueServers.find(s => s.id === "::queueServerId::")).toBeDefined();
    });

    it("Should deactivate an active server", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [{
          id: "::queueServerId::",
          reservation: null,
        }],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: false,
        })
        .set("Accept", "application/json")
        .expect(200);

      const object = await queueServerOperatorRepository.getModel().findOne({
        id: "::queueServerOperatorId::",
      });
      expect(object?.activeQueueServers.find(s => s.id === "::queueServerId::")).not.toBeDefined();
    });

    it("Should return 400 on missing queueServerOperatorId", async () => {
      const response = await request(app)
        .post(PATH)
        .send({
          queueServerId: "::serverId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(400);

      console.log(response.body);
    });

    it("Should return 400 on missing queueServerId", async () => {
      const response = await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::operatorId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(400);

      console.log(response.body);
    });

    it ("Should return 400 on missing setAsActive", async () => {
      const response = await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::operatorId::",
          queueServerId: "::serverId::",
        })
        .set("Accept", "application/json")
        .expect(400);

      console.log(response.body);
    });

    it("Should return 403 when operator doesn't have access to server", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::otherQueueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(403);
    });

    it("Should return 404 when operator is not found", async () => {
      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(404);
    });

    it("Should return 404 when server is not found", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(404);
    });

    it("Should return 409 when activating an already active server", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [{
          id: "::queueServerId::",
          reservation: null,
        }],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: true,
        })
        .set("Accept", "application/json")
        .expect(409);
    });

    it("Should return 409 when deactivating an already inactive server", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
          setAsActive: false,
        })
        .set("Accept", "application/json")
        .expect(409);
    });
  });

  describe("/mark-as-free", () => {
    const PATH = "/manager/server/mark-as-free";

    it("Should mark a busy queue server as free", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [{
          id: "::queueServerId::",
          reservation: {
            id: "reservationId",
            serviceStartTime: "1",
          },
        }],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });
      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
        })
        .set("Accept", "application/json")
        .expect(200);


        const object = await queueServerOperatorRepository.getModel().findOne({id: "::queueServerOperatorId::"});
        expect(object?.activeQueueServers.find(s => s.id === "::queueServerId::")?.reservation).toBeNull();
    });

    it ("Should return 400 when queueServerId is missing from request", async () => {
      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
        })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("Should return 400 when queueServerOperatorId is missing from request", async () => {
      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
        })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("Should return 404 when server is not found", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
        })
        .set("Accept", "application/json")
        .expect(404);
    });

    it("Should return 404 when operator is not found", async () => {
      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });

      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
        })
        .set("Accept", "application/json")
        .expect(404);
    });

    it("Should return 403 when operator is not allowed on server",async  () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: [],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });
      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
        })
        .set("Accept", "application/json")
        .expect(403);
    });

    it("Should return 409 when server is already free", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [{
          id: "::queueServerId::",
          reservation: null,
        }],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });
      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
        })
        .set("Accept", "application/json")
        .expect(409);
    });

    it("Should return 409 when server is inactive", async () => {
      await queueServerOperatorRepository.getModel().create({
        id: "::queueServerOperatorId::",
        assignedQueueServerIds: ["::queueServerId::"],
        assignedQueueNodeIds: [],
        activeQueueServers: [],
      });

      await queueServerRepository.getModel().create({
        id: "::queueServerId::",
        assignedQueueNodeIds: [],
      });
      await request(app)
        .post(PATH)
        .send({
          queueServerOperatorId: "::queueServerOperatorId::",
          queueServerId: "::queueServerId::",
        })
        .set("Accept", "application/json")
        .expect(409);
    });
  });
});
