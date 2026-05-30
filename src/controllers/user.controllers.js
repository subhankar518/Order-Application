import { sendEmail } from "../config/email.config.js";
import { User } from "../models/user.model.js";
import { passwordHash } from "../utils/passwordHash.utils.js";
import bcryptjs from "bcryptjs";
import { verifyEmailTemplate } from "../utils/verifyEmailTemplate.utils.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwtToken.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

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

export { registerUser, verifyEmailUpdate, userLogin, userLogout, uploadAvatar };
