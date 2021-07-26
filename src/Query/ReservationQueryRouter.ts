import express from "express";
import MongooseActiveReservationRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import IActiveReservation from "@app/Command/Infrastructure/Mongoose/Types/IActiveReservation";
import MongooseQueueNodeStatsRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueNodeStatsRepository";

export default async function createReservationQueryRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();
  const repo = container
    .resolve<MongooseActiveReservationRepository>(DiEntry.ActiveReservationRepository);

  router.get("/", async (request, response) => {
    const filter: Partial<IActiveReservation> = {}
    if (request.query.clientId && typeof request.query.clientId === "string")
      filter.clientId = request.query.clientId;
    if (request.query.queueNodeId && typeof request.query.queueNodeId === "string")
      filter.queueNodeId = request.query.queueNodeId;
    const instances = await repo.getAll(filter);
    const result = instances.map(d => repo.getTransformer().mongooseObjectFrom(d));
    response.json(result);
  });

  router.get("/:id", async (request, response) => {
    const {id} = request.params;
    try {
      const instance = await repo.getById(QueueServerOperatorId.from(id));
      const result = repo.getTransformer().mongooseObjectFrom(instance);
      const queueNodeStatsRepository = container
        .resolve<MongooseQueueNodeStatsRepository>(DiEntry.QueueNodeStatsRepository)
      let expectedWaitingTime: number|null = null;
      try {
        const queueNodeStats = await queueNodeStatsRepository.getByQueueNodeId(instance.getQueueNodeId());
        expectedWaitingTime = queueNodeStats.getAverageServingTime();
      } catch(e) {
        console.log(e);
      }
      response.json({
        ...result,
        expectedWaitingTime: expectedWaitingTime === null ?
          "No data about this queue node available"
          : expectedWaitingTime
      });
    } catch(e) {
      console.log(e);
      response.status(404).json({
        message: `Reservation with id ${id} not found`,
      });
    }
  });
  return router;
}
