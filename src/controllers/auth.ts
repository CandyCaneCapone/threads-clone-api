import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import IUser from "../types/user";
import UnAuthenticatedError from "../errors/unauthenticated";
import BadRequestError from "../errors/bad-request";
import generateTokenAndSetCookie from "../utils/set-token";

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

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("please provide email and password");
    }

    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw new UnAuthenticatedError("wrong email or password");
    }

    const isPasswordCorrect: boolean = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError("wrong email or password");
    }
    generateTokenAndSetCookie({ _id: user._id }, res);

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export { signup, login };
