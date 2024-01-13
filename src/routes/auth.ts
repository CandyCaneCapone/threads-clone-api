import { Router } from "express";
const authRouter: Router = Router()

import * as controller from "../controllers/auth"

authRouter.post("/signup" , controller.signup)

export default authRouter ; 