import { ErrorRequestHandler } from "express";

const ErrorHandler: ErrorRequestHandler = (err, request, response, next) => {
  // if(err instanceof EmployeeNotAuthorizedError){
  //   response.status(403).json({
  //     message: "User is not authorized to carry this action"
  //   });
  // } else if (err instanceof ValidationError) {
  //   response.status(400).json({
  //     message: err.message,
  //   });
  // } else if (err instanceof IncorrectCredentialsError) {
  //   response.status(401).json({
  //     message: err.message,
  //   })
  // } else{
  //   response.status(500).json({
  //     message: err.message
  //   });
  // }
  next(err);
};

export default ErrorHandler;
