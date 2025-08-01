/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../configs/env";
import {
  handleCastError,
  handleDuplicateError,
  handleValidationError,
  handleZodError,
} from "../helpers/error.helpers";
import { TError } from "../app/interfaces/error";

export const globalMiddleHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `something went wrong`;
  let errorSources: TError[] = [];
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  //  else if (err instanceof AppError) {
  //   statusCode = err.statusCode;
  //   message = err.message;
  // }
  //  else if (err instanceof Error) {
  //   statusCode = 500;
  //   message = err.message;
  // }
  else if (err.name === "CastError" || err.name === "castError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);

    statusCode = simplifiedError.statusCode;

    errorSources = simplifiedError.errorSources;
  } else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.StatusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TError[];
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
