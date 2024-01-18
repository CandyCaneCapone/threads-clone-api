import { Router } from "express";
const userRouter : Router = Router()

import * as controller from "../controllers/user"
import upload from "../utils/upload";

userRouter.get("/profile" , controller.getProfile)
userRouter.get("/user" , controller.getOthersProfile)
userRouter.post("/follow/:id" , controller.followUnFollowUser)
userRouter.patch("/edit" , upload.single("profilePic") ,controller.editProfile)

export default userRouter ; 