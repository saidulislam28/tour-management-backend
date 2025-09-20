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
import { deleteCloudinaryImage } from "../configs/cloudinary.config";

export const globalMiddleHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {


  console.log("error from global handler", err)


  if (req.file) {
    await deleteCloudinaryImage(req.file.path)
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

    await Promise.all(imageUrls.map((url) => deleteCloudinaryImage(url)))
  }






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
