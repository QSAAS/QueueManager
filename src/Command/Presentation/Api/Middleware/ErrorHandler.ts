import { ErrorRequestHandler } from "express";
import ValidationError from "@app/Command/Application/Error/ValidationError";

// TODO: so many possible throws
const ErrorHandler: ErrorRequestHandler = (err, request, response, next) => {
  if (err instanceof ValidationError) {
    response.status(400).json({
      message: err.message,
    });
  } else {
    response.status(500).json({
      message: err.message,
    });
  }
  next(err);
};

export default ErrorHandler;
