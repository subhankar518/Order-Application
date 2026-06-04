import { sendEmail } from "../config/email.config.js";
import { User } from "../models/user.model.js";
import { passwordHash } from "../utils/passwordHash.utils.js";
import bcryptjs from "bcryptjs";
import {
    forgotPasswordTemplate,
    verifyEmailTemplate,
} from "../utils/Template.utils.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "../utils/jwtToken.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { generateOtp } from "../utils/generateOtp.utils.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide required fields",
                error: true,
                success: false,
            });
        }

        const availableUser = await User.findOne({ email });

        if (availableUser) {
            return res.status(400).json({
                message: "Already registered email",
                error: true,
                success: false,
            });
        }

        const hashedPassword = await passwordHash(password);

        const payload = {
            name,
            email,
            password: hashedPassword,
        };

        const newUserWithPayload = new User(payload);
        const newUser = await newUserWithPayload.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser?._id}`;

        const verificationEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from Order Application",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl,
            }),
        });

        return res.status(200).json({
            message: "User Registration Successfull",
            error: false,
            success: true,
            data: newUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const verifyEmailUpdate = async (req, res) => {
    try {
        const { code } = req.body;

        const user = await User.findOne({ _id: code });
        if (!user) {
            return res.status(500).json({
                message: "Invalid Code !!",
                error: true,
                success: false,
            });
        }

        const updatedUser = await User.updateOne(
            { _id: code },
            {
                verify_email: true,
            }
        );

        return res.status(200).json({
            message: "Email is verified.",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password.",
                error: true,
                success: false,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: `User not exist`,
                error: true,
                success: false,
            });
        }

        if (user.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Your account is not active, Please contact to Admin",
                error: true,
                success: false,
            });
        }

        const checkPassword = await bcryptjs.compare(password, user?.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: "Please provide right email and password",
                error: true,
                success: false,
            });
        }

        const accessToken = await generateAccessToken(user?._id);
        const refreshToken = await generateRefreshToken(user?._id);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        res.cookie("accessToken", accessToken, cookiesOption);
        res.cookie("refreshToken", refreshToken, cookiesOption);

        return res.status(200).json({
            message: "Login Successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const userLogout = async (req, res) => {
    try {
        const userId = req.userId; // from middleware
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        res.clearCookie("accessToken", cookiesOption);
        res.clearCookie("refreshToken", cookiesOption);

        const removeRefreshToken = await User.findByIdAndUpdate(userId, {
            refreshToken: "",
        });

        return res.status(200).json({
            message: "Logout Successful",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

// multer recheck
const uploadAvatar = async (req, res) => {
    try {
        const image = req?.file; // coming from multer middleware
        const userId = req?.userId; // coming from auth middleware

        const uploadImage = await uploadOnCloudinary(image);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            avatar: uploadImage?.url,
        });

        return res.status(200).json({
            message: "Avatar Successfully Uploaded",
            error: false,
            success: true,
            data: {
                userId: userId,
                avatar: uploadImage?.url,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const userId = req?.userId; // from middleware
        const { name, email, password, phone } = req.body;

        if (password) {
            const hashedPassword = await passwordHash(password);
        }
        const updatedUser = await User.updateOne(
            { _id: userId },
            {
                ...(name && { name: name }), // this spread check is needed for prevent undefined
                ...(email && { email: email }),
                ...(password && { password: hashedPassword }),
                ...(phone && { phone: phone }),
            }
        );

        return res.status(200).json({
            message: "User updated successfully",
            error: true,
            success: false,
            data: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const forgotPasswordHandler = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Please provide currect email",
                error: true,
                success: false,
            });
        }

        const otp = generateOtp();
        const otpExpireTime = new Date() + 60 * 60 * 1000; // 1hr

        const updateDb = await User.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(otpExpireTime).toISOString(),
        });

        await sendEmail({
            sendTo: email,
            subject: "Forgot password OTP from Order Application",
            html: forgotPasswordTemplate({
                name: user?.name,
                otp: otp,
            }),
        });

        return res.status(200).json({
            message: "Please Check your email",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const verifyForgotPasswordOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Please provide required fields email and otp",
                error: true,
                success: false,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Please provide currect email",
                error: true,
                success: false,
            });
        }

        const currentTime = new Date().toISOString();

        // forgot_password_expiry will end on after 1hr, if currentTime is above 1 hr then the logic works
        if (user?.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false,
            });
        }

        if (otp !== user?.forgot_password_otp) {
            return res.status(400).json({
                message: "Otp is invalid",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            message: "Otp verified successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message:
                    "Please provide required fields email, newPassword and confirmPassword",
                error: true,
                success: false,
            });
        }

        const user = User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email is not avaliable",
                error: true,
                success: false,
            });
        }

        if (newPassword != confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password must be same",
                error: true,
                success: false,
            });
        }

        const hashedPassword = passwordHash(newPassword);
        const updatePassword = await User.findOneAndUpdate(user?._id, {
            password: hashedPassword,
        });

        return res.status(200).json({
            message: "Password rest successfull",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

const newAccessTokenRequest = async (req, res) => {
    try {
        const refreshToken =
            req?.cookie?.refreshToken ||
            req?.header?.authorization?.split(" ")[1] ||
            req?.header("Authorization")?.replace("Bearer ", "");

        if (!refreshToken) {
            return res.status(402).json({
                message: "Invalid Token",
                error: true,
                success: false,
            });
        }

        const verify = await verifyToken(refreshToken);

        if (!verify) {
            return res.status(401).json({
                message: "Token is expired !",
                error: true,
                success: false,
            });
        }

        console.log(verify); // maybe id

        const userId = verify?._id;

        const newAccessToken = await generateAccessToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        res.cookie("accessToken", newAccessToken, cookiesOption);

        return res.status(200).json({
            message: "New access token generated successfully",
            error: false,
            success: true,
            data: {
                accessToken,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export {
    registerUser,
    verifyEmailUpdate,
    userLogin,
    userLogout,
    uploadAvatar,
    updateUserDetails,
    forgotPasswordHandler,
    verifyForgotPasswordOtp,
    resetPassword,
    newAccessTokenRequest,
};
