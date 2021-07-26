import express from "express";
import MongooseActiveReservationRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";

export default async function createReservationQueryRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();
  const repo = container
    .resolve<MongooseActiveReservationRepository>(DiEntry.ActiveReservationRepository);

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
        message: `Reservation with id ${id} not found`,
      });
    }
  });
  return router;
}
