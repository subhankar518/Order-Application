import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateAccessToken = async (userId) => {
    const token = await jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "5h",
        }
    );

    return token;
};

const generateRefreshToken = async (userId) => {
    const token = await jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d",
        }
    );

    const updateRefreshToken = await User.updateOne(
        { _id: userId },
        {
            refreshToken: token,
        }
    );

    return token;
};

const verifyToken = async (refreshToken) => {
    const result = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );
    return result;
};

export { generateAccessToken, generateRefreshToken, verifyToken };
