import express from "express";
import "express-async-errors";
import createOrganizationAdministrationRouter from "@app/Command/Presentation/Api/Routes/Router";
import dotenv from "dotenv";
import createReservationQueryRouter from "@app/Query/ReservationQuery";

dotenv.config();

export default async function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/manager", await createOrganizationAdministrationRouter());
  app.use("/query", await createReservationQueryRouter())
  return app;
}
