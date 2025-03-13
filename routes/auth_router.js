import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);
authRouter.get("/sign-out", signOut);

export default authRouter;
