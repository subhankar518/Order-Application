import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./src/db/connectDb.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(morgan()); // api log
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const PORT = process.env.PORT || 8001;

connectDB().then(() => {
  app.on("error", (error) => {
    console.log("ERROR ", error);
  });
  app.listen(PORT, () => {
    console.log("Server is running on : ", PORT);
  });
});

// app.get("/", (req, res) => {
//   res.json({
//     message: "running",
//   });
// });

import { userRouter } from "./src/routes/user.route.js";

app.use("/api/v1/users", userRouter);
