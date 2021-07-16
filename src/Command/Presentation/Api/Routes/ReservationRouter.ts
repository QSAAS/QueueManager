import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import { DiEntry } from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import express from "express";
import ReservationController from "@app/Command/Presentation/Api/Controller/ReservationController";

function createReservationRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();

  const controller = container.resolve<ReservationController>(DiEntry.ReservationController);

  router.post("/cancel", async (request, response) => {
    await controller.cancel(request, response);
  });

  return router;
}

export default createReservationRouter;
