import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // only used for if condition proper work, otherwise if condition not working properly.

if (!process.env.MONGODB_URL) {
  throw new Error("Please Provide Database URL in .env !!");
}

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
    );
    console.log(
      `\nMongoDB Connected Successfully ! DB Host: ${connectionInstance.connection.host}`,
    );
    // console.log("connectionInstance ", connectionInstance)
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};
