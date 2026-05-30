import { Router } from "express";
import {
    registerUser,
    uploadAvatar,
    userLogin,
    userLogout,
    verifyEmailUpdate,
} from "../controllers/user.controllers.js";
import { authHandler } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-email", verifyEmailUpdate);
userRouter.post("/login", userLogin);

userRouter.get("/logout", authHandler, userLogout);
userRouter.put(
    "/upload-avatar",
    authHandler,
    upload.single("avatar"),
    uploadAvatar
); // for small update

export { userRouter };
