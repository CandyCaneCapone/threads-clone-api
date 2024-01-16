import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import protectRoute from "../middlewares/protect-route";
const router : Router = Router()

router.use("/auth" , authRouter)
router.use("/user" , protectRoute ,userRouter)

export default router ; 