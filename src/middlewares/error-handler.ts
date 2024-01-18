import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  NotFoundError,
  UnAuthenticatedError,
  BadRequestError,
} from "../errors";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let message = "Something went wrong";
  let statusCode = 500;

  if (err instanceof NotFoundError) {
    (message = err.message), (statusCode = err.statusCode);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(",");
    statusCode = 400;
  }

  if (err instanceof UnAuthenticatedError) {
    message = err.message;
    statusCode = err.statusCode;
  }

  if (err instanceof BadRequestError) {
    message = err.message;
    statusCode = err.statusCode;
  }

  if (err instanceof mongoose.Error.CastError) {
    message = `no resource found with id ${err.value}`
    statusCode = 404
  }
  console.log(err);

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};

export default errorHandler;
