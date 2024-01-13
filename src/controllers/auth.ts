import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import IUser from "../types/user";
import UnAuthenticatedError from "../errors/unauthenticated";

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, username, email, password } = req.body;
    const userAlreadyExist = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userAlreadyExist) {
      throw new UnAuthenticatedError("username or email already exist");
    }

    const user: IUser = await User.create({ name, username, email, password });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export { signup };
