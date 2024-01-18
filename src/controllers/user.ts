import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import IUser from "../types/user";

import AuthenticatedRequest from "../types/auth-req";
import mongoose, { ObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../errors";

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
        user = await User.findOne({ username: query }).select(
          "-password -email -updatedAt"
        );
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

const followUnFollowUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id: userId } = req.params;

    const currentUser: IUser = req.user!;
    const userToModify: IUser | null = await User.findById(userId);

    if (!userToModify) {
      throw new NotFoundError("user not found");
    }

    if (userToModify._id.toString() === currentUser._id.toString()) {
      throw new BadRequestError("you cannot follow or unfollow yourself")
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isFollowing = currentUser.following.includes(userObjectId as any);

    if (isFollowing) {
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userObjectId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUser._id },
      });

      res.json({ message: "user unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(currentUser?._id, {
        $push: { following: userObjectId },
      });
      await User.findByIdAndUpdate(userId, {
        $push: { followers: currentUser._id },
      });
      res.json({ message: "User followed successfully" });

    }
  } catch (error) {
    next(error);
  }
};

export { getProfile, getOthersProfile , followUnFollowUser};
