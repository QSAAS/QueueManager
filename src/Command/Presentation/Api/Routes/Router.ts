import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import DependencyDefinitions, { DiEntry } from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import express from "express";
import ErrorHandler from "@app/Command/Presentation/Api/Middleware/ErrorHandler";
import createReservationRouter from "@app/Command/Presentation/Api/Routes/ReservationRouter";
import createQueueServerRouter from "@app/Command/Presentation/Api/Routes/QueueServerRouter";
import createQueryRouter from "@app/Query/QueryRouter";

let container: DependencyInjectionContainer<DiEntry>;

export async function getDependencyContainer() {
  if (container === undefined) {
    container = new DependencyInjectionContainer<DiEntry>();
    await container.addDefinitions(DependencyDefinitions);
  }
  return container;
}

async function createRouter() {
  const router = express.Router();
  const containerInstance = await getDependencyContainer();
  router.use("/reservation", createReservationRouter(containerInstance));
  router.use("/server", createQueueServerRouter(containerInstance));
  router.use("/query", await createQueryRouter(containerInstance))
  router.use(ErrorHandler);

  return router;
}

export default createRouter;
