import { Request, Response, NextFunction } from "express";
import NotFoundError from "../errors/not-found";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    let message = "Something went wrong" 
    let statusCode = 500 

    if (err instanceof NotFoundError) {
        message = err.message , 
        statusCode = err.statusCode
    }

    res.status(statusCode).json({
        error : {
            message
        }
    })
};


export default errorHandler ; 