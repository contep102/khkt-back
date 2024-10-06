import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./router/userRor.js"; // Ensure the import path is correct
import RoomRoute from "./router/roomRor.js"; // Ensure the import path is correct
import ContestRoute from "./router/contestRor.js";
import mongoose from "mongoose";
import morgan from "morgan";
import { app, server } from "./socket/socket.js";
import { ExpressPeerServer } from "peer";
import {
  autoContestComing,
  autoContestProgress,
} from "./auto-api/changeContest.js";
import {
  leaveRoom,
  getUserName,
  initialUpdate,
  notifiyParticipantLeftRoom,
  addMember,
} from "./utils/roomHandler.js";
dotenv.config();

app.set("trust proxy", 1);
const corsOptions = {
  origin: "*",
};
app.use(express.json()); // Place before rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
      status: 429,
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    },
  })
);
app.use(cors(corsOptions));
app.use(morgan("dev"));

const peerServer = ExpressPeerServer(server, {
  debug: true,
  secure: true,
});
app.use("/api/user", UserRoute);
app.use("/api/room", RoomRoute);
app.use("/api/contest", ContestRoute);
app.use("/peerjs", peerServer);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    server.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });
    setInterval(autoContestComing, 10 * 1000);
    setInterval(autoContestProgress, 10 * 1000);
  })
  .catch((err) => {
    console.log("Something went wrong:", err);
  });
