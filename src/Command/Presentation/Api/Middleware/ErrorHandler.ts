import { ErrorRequestHandler } from "express";
import ValidationError from "@app/Command/Application/Error/ValidationError";
import ClientNotAuthorizedToCancelReservation from "@app/Command/Domain/Error/ClientNotAuthorizedToCancelReservation";
import ReservationNotCancellable from "@app/Command/Domain/Error/ReservationNotCancellable";

// TODO: so many possible throws
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
  }
  else {
    response.status(500).json({
      message: err.message,
    });
  }
  next(err);
};

export default ErrorHandler;
