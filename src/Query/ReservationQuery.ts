import express from "express";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import MongooseActiveReservationRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseActiveReservationRepository";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import ClientId from "@app/Command/Domain/ValueObject/ClientId";

export default async function createReservationQueryRouter() {
  const router = express.Router();
  const containerInstance = await getDependencyContainer();
  router.get("/", async (request, response) => {
    const activeReservationRepository = containerInstance
      .resolve<MongooseActiveReservationRepository>(DiEntry.ActiveReservationRepository);
    const clientId = request.query?.clientId;
    console.log(clientId);
    if (!clientId) {
      response.status(400).json({
        error: "Missing required parameter clientId",
      });
    } else if (typeof (clientId) !== "string") {
      response.status(400).json({
        error: "clientId must be a string",
      });
    } else {
      const ret = await activeReservationRepository.getByClientId(ClientId.from(clientId));
      response.json(ret);
    }
  });
  return router;
}
