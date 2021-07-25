import express from "express";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import QueueServerOperatorRepository from "@app/Command/Domain/Service/QueueServerOperatorRepository";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";

export default async function createQueueServerOperatorRouter() {
  const router = express.Router();
  const containerInstance = await getDependencyContainer();
  router.get("/", async (request, response) => {
    const queueServerOperatorRepository = containerInstance
      .resolve<QueueServerOperatorRepository>(DiEntry.QueueServerOperatorRepository);
    const queueServerOperatorId = request.query?.queueServerOperatorId;
    if (!queueServerOperatorId) {
      response.status(400).json({
        error: "Missing required parameter queueServerOperatorId",
      }).json();
    } else if (typeof (queueServerOperatorId) != "string") {
      response.status(400).json({
        error: "queueServerOperatorId must be a string",
      }).json();
    } else {
      try {
        const ret = await queueServerOperatorRepository.getById(QueueServerOperatorId.from(queueServerOperatorId));
        response.json(ret);
      } catch(e) {
        response.status(404).json({
          error: "Operator not found"
        }).json();
      }
    }
  });
  return router;
}
