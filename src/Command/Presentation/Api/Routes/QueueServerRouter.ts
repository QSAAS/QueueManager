import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import { DiEntry } from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import express from "express";
import QueueServerController from "@app/Command/Presentation/Api/Controller/QueueServerController";

function createQueueServerRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();

  const controller = container.resolve<QueueServerController>(DiEntry.QueueServerController);

  router.post("/change-status", async (request, response) => {
    await controller.changeStatus(request, response);
  });

  router.post("/mark-as-free", async (request, response) => {
    await controller.markAsFree(request, response);
  });

  return router;
}

export default createQueueServerRouter;
