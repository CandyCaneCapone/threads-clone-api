import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import IUser from "../types/user";

import AuthenticatedRequest from "../types/auth-req";
import mongoose from "mongoose";
import { NotFoundError } from "../errors";

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

const getOthersProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { query } = req.query;
    let user = null;

    if (typeof query == "string") {
      if (mongoose.Types.ObjectId.isValid(query)) {
        user = await User.findById(query).select("-password -email -updatedAt");
      } else {
        user = await User.findOne({ username: query }).select("-password -email -updatedAt");
      }
    }

    if (!user) {
      throw new NotFoundError("user not found");
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export { getProfile, getOthersProfile };
