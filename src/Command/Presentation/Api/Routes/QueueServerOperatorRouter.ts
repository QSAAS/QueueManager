import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import express from "express";

function createQueueServerOperatorRouter(container: DependencyInjectionContainer<DiEntry>) {
  const router = express.Router();
  return router;
}

export default createQueueServerOperatorRouter;
