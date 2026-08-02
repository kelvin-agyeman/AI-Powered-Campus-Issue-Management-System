import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

interface MongooseError extends Error {
  name: string;
  statusCode?: number;
  code?: number;
  value?: string;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

const errorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
 
  const error = err as MongooseError;

  const customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: error.message || "Something went wrong try again later",
  };

  if (error.name === "ValidationError" && error.errors) {
    customError.msg = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (error.code === 11000 && error.keyValue) {
    const fields = Object.keys(error.keyValue).join(", ");
    customError.msg = `Duplicate value entered for [${fields}] field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (error.name === "CastError") {
    customError.msg = `No item found with id : ${error.value || "unknown"}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
