import mongoose from "mongoose";
import { TError } from "../app/interfaces/error";

export const handleDuplicateError = (err: any) => {
  const matchedArray = err.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchedArray[1]} already exist`,
  };
};

export const handleCastError = (err: mongoose.Error.CastError) => {
  console.log(err);
  return {
    statusCode: 400,
    message: "Invalid Mongodb objectId. Provide a valid id.",
  };
};

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: TError[] = [];

  const errors = Object.values(err.errors);
  errors.forEach((e: any) =>
    errorSources.push({
      path: e.path,
      message: e.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error Occurred",
    errorSources,
  };
};

export const handleZodError = (err: any) => {
  const errorSources: TError[] = [];

  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    StatusCode: 400,
    message: "zod error",
    errorSources,
  };
};