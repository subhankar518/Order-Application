import { Router } from "express";
import {
    forgotPasswordHandler,
    registerUser,
    updateUserDetails,
    uploadAvatar,
    userLogin,
    userLogout,
    verifyEmailUpdate,
    verifyForgotPasswordOtp,
    resetPassword,
    newAccessTokenRequest,
} from "../controllers/user.controllers.js";
import { authHandler } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-email", verifyEmailUpdate);
userRouter.post("/login", userLogin);
userRouter.put("/forgot-password", forgotPasswordHandler);
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.put("/reset-password", resetPassword);
userRouter.put("/new-access-token", newAccessTokenRequest);

userRouter.get("/logout", authHandler, userLogout);
userRouter.put(
    "/upload-avatar",
    authHandler,
    upload.single("avatar"),
    uploadAvatar
); // for small update
userRouter.put("/update-user", authHandler, updateUserDetails);

export { userRouter };
