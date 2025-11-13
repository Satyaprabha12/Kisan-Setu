import e from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controllers.js";

const authRouter = e.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.get("/signout", signOut)

export default authRouter