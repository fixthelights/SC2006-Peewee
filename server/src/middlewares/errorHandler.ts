import { NextFunction, Request, Response } from "express";
import { AppError } from "../config/AppError";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handled errors
  if(err instanceof AppError) {
    const { type ,statusCode, error} = err;
    console.error(err.statusCode, err.type, err.error);

    return res.status(statusCode).send({ 
        error: {
            statusCode: err.statusCode,
            description: err.message,
            rawError: err.error
        }
    });
  }
  
  // Unhandled errors
  console.error(err);
  return res.status(500).send({
    error: {
        message: "Something went wrong!",
        stack: err.stack
    }
  });
};