import e from "express";
import { getCurrentUser } from "../controllers/user.controllers.js";
import isAuth from "../middleware/isauth.js";

const userRouter = e.Router()

userRouter.get("/current", isAuth,getCurrentUser)


export default userRouter