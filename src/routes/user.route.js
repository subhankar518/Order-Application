import { Router } from "express";
import {
  registerUser,
  userLogin,
  userLogout,
  verifyEmailUpdate,
} from "../controllers/user.controllers.js";
import { authHandler } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-email", verifyEmailUpdate);
userRouter.post("/login", userLogin);

userRouter.get("/logout", authHandler, userLogout);

export { userRouter };
