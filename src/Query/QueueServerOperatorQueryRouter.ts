import express from "express";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import MongooseQueueServerOperatorRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerOperatorRepository";

export default async function createQueueServerOperatorRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();
  const repo = container
    .resolve<MongooseQueueServerOperatorRepository>(DiEntry.QueueServerOperatorRepository);
  router.get("/", async (request, response) => {
      const instances = await repo.getAll();
      const result = instances.map(d => repo.getTransformer().mongooseObjectFrom(d));
      response.json(result);
  });

  router.get("/:id", async (request, response) => {
    const {id} = request.params;
    try {
      const instance = await repo.getById(QueueServerOperatorId.from(id));
      const result = repo.getTransformer().mongooseObjectFrom(instance);
      response.json(result);
    } catch(e) {
      response.status(404).json({
        message: `Queue server operator with id ${id} not found`,
      });
    }
  });

  return router;
}
