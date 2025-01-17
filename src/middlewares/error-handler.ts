import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger";
import { ErrorHandler } from "../services/ErrorService";

export const globalErrorHandler = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Assign default values if not provided
  const errorId = uuidv4(); // Unique identifier for tracking
  const statusCode = err.statusCode || 500;
  const message =
    err.name === "CastError"
      ? "Invalid ID"
      : err.message || "Internal Server Error";
  const isProduction = process.env.NODE_ENV === "prod";

  // Log the error
  logger.error("Error occurred", {
    id: errorId,
    message: err.message,
    statusCode: statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Respond with error details
  res.status(statusCode).json({
    errorId,
    success: false,
    message,
    path: req.path,
    method: req.method,
    ...(isProduction ? {} : { stack: err.stack }), // Include stack only in non-production
  });
};
