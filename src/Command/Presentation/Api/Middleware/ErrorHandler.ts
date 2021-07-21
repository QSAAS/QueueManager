import { ErrorRequestHandler } from "express";
import ValidationError from "@app/Command/Application/Error/ValidationError";
import ClientNotAuthorizedToCancelReservation from "@app/Command/Domain/Error/ClientNotAuthorizedToCancelReservation";
import ReservationNotCancellable from "@app/Command/Domain/Error/ReservationNotCancellable";
import QueueServerOperatorNotFound from "@app/Command/Domain/Error/QueueServerOperatorNotFound";
import QueueServerNotFound from "@app/Command/Domain/Error/QueueServerNotFound";
import QueueServerIsInactive from "@app/Command/Domain/Error/QueueServerIsInactive";
import QueueServerIsActive from "@app/Command/Domain/Error/QueueServerIsActive";
import ServerOperatorNotAllowedToAccessServer from "@app/Command/Domain/Error/ServerOperatorNotAllowedToAccessServer";
import ActiveQueueServerIsFree from "@app/Command/Domain/Error/ActiveQueueServerIsFree";

const ErrorHandler: ErrorRequestHandler = (err, request, response, next) => {
  if (err instanceof ValidationError) {
    response.status(400).json({
      message: err.message,
    });
  } else if (err instanceof ClientNotAuthorizedToCancelReservation) {
    response.status(403).json({
      message: "Client not authorized to cancel reservation",
    });
  } else if (err instanceof ReservationNotCancellable) {
    response.status(409).json({
      message: "Reservation not cancellable",
    });
  } else if (err instanceof QueueServerOperatorNotFound) {
    response.status(404).json({
      message: "Queue server not found",
    });
  } else if (err instanceof QueueServerNotFound) {
    response.status(404).json({
      message: "Queue server operator not found",
    });
  } else if (err instanceof QueueServerIsInactive) {
    response.status(409).json({
      message: "Queue server is active",
    });
  } else if (err instanceof QueueServerIsActive) {
    response.status(409).json({
      message: "Queue server is inactive",
    });
  } else if (err instanceof ServerOperatorNotAllowedToAccessServer) {
    response.status(403).json({
      message: "Server is not allowed to access server",
    });
  } else if (err instanceof ActiveQueueServerIsFree) {
    response.status(409).json({
      message: "Active queue server is free",
    });
  } else {
    response.status(500).json({
      message: err.message,
    });
  }
  next(err);
};

export default ErrorHandler;
