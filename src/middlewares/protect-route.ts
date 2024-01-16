import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import IUser from "../types/user";
import { UnAuthenticatedError } from "../errors";

import AuthenticatedRequest from "../types/auth-req";

const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token: string = req.cookies.jwt;

  try {
    if (!token) throw new UnAuthenticatedError("please provide token");

    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
    const user: IUser | null = await User.findById(decoded._id);

    if (!user) {
      throw new UnAuthenticatedError("please provide a valid token");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
