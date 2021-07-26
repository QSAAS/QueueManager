import express from "express";
import createQueueServerOperatorRouter from "@app/Query/QueueServerOperatorQueryRouter";
import createReservationQueryRouter from "@app/Query/ReservationQueryRouter";
import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";

export default async function createQueryRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();
  router.use("/queue-server-operator", await createQueueServerOperatorRouter(container));
  router.use("/reservation", await createReservationQueryRouter(container));
  return router;
}
