import { Router } from "express";
const userRouter : Router = Router()

import * as controller from "../controllers/user"

userRouter.get("/profile" , controller.getProfile)

export default userRouter ; 