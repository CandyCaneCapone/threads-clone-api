import { Router } from "express";
const authRouter: Router = Router()

import * as controller from "../controllers/auth"

authRouter.post("/signup" , controller.signup)
authRouter.post("/login" , controller.login)
authRouter.post("/logout" , controller.logout)

export default authRouter ; 