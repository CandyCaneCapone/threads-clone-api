import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import IUser from "../types/user";

import AuthenticatedRequest from "../types/auth-req";
import mongoose, { Types } from "mongoose";
import { BadRequestError, NotFoundError } from "../errors";

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Find the user by their ID, excluding the password field
    const userId: string | null = req.user!._id;
    const user: IUser = await User.findById(userId).select("-password");

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const editProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, username, email, password, bio } = req.body;

    // Check if a user with the provided username or email already exists
    const usernameOrEmailAlreadyExists: IUser | null = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (usernameOrEmailAlreadyExists) {
      throw new BadRequestError("email or username already exist");
    }

    const user = req.user!;
    
    // Update user properties with the new values if they exist in the request body
    user.name = name || user.name 
    user.username = username || user.username
    user.email = email || user.email 
    user.password = password || user.password
    user.bio = bio || user.bio

    await user.save()

    res.json({user : req.user});
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
      // If 'query' is a valid ObjectId, find the user by ID
      if (mongoose.Types.ObjectId.isValid(query)) {
        user = await User.findById(query).select("-password -email -updatedAt");
      } else {
        // If 'query' is not a valid ObjectId, find the user by username
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

    // Check if the user is trying to follow/unfollow themselves
    if (userToModify._id.toString() === currentUser._id.toString()) {
      throw new BadRequestError("you cannot follow or unfollow yourself");
    }

    // Convert string to objectId
    const userObjectId: Types.ObjectId = new Types.ObjectId(userId);

    // Check if the current user is already following the target user
    const isFollowing: boolean = currentUser.following.includes(
      userObjectId as any
    );

    if (isFollowing) {
      // If already following, unfollow the user
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userObjectId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUser._id },
      });

      res.json({ message: "user unfollowed successfully" });
    } else {
      // If not following, follow the user
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

export { getProfile, getOthersProfile, followUnFollowUser , editProfile };
