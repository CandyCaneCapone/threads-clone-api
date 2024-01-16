import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import IUser from "../types/user";

import AuthenticatedRequest from "../types/auth-req";

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId: string | null = req.user!._id;
    const user: IUser = await User.findById(userId).select("-password");

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export { getProfile };
