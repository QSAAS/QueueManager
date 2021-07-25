import express from "express";
import createQueueServerOperatorRouter from "@app/Query/QueueServerOperatorQuery";
import createReservationQueryRouter from "@app/Query/ReservationQuery";

export default async function createQueryRouter() {
  const router = express.Router();
  router.use("/queue-server-operator", await createQueueServerOperatorRouter());
  router.use("/client-reservations", await createReservationQueryRouter());
  return router;
}
