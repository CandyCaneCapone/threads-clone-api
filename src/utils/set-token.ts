import jwt from "jsonwebtoken";
import { Response } from "express";

const generateTokenAndSetCookie = (payload: object, res: Response): void => {
  if (process.env.SECRET_KEY) {
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_LIFETIME,
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
  }
};

export default generateTokenAndSetCookie;
