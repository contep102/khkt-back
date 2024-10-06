import http from "http";
import { ExpressPeerServer } from "peer";
import { Server } from "socket.io";
import express from "express";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  // path: "/socket.io",
  // pingTimeout: 60000,
  // pingInterval: 25000,
  // cors: {
  //   origin: ["*"],
  //   methods: ["GET", "POST"],
  // },
  // allowEIO3: true,
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const roomMembers = new Map();

const socketToRooms = new Map();

io.on("connection", (socket) => {
  initialUpdate(roomMembers, socketToRooms);

  socket.on("disconnect", () => {
    leaveRoom(socket, roomMembers, socketToRooms);
  });

  socket.on("join-room", (data) => {
    const { roomId, email } = data;
    socket.join(roomId);

    addMember({ roomId, email, socket }, roomMembers, socketToRooms);
  });

  socket.on("leave-room", (data) => {
    const { roomId } = data;

    leaveRoom(socket, roomMembers, socketToRooms);

    socket.leave(roomId);
  });

  socket.on("connection-init", (data) => {
    const { incomingSocketId } = data;

    const initData = { incomingSocketId: socket.id };
    socket.to(incomingSocketId).emit("connection-init", initData);
  });

  socket.on("connection-signal", (signalData) => {
    const { incomingSocketId, signal } = signalData;

    const serverSignalingData = { signal, incomingSocketId: socket.id };

    socket.to(incomingSocketId).emit("connection-signal", serverSignalingData);
  });

  socket.on("send_message", (msgData) => {
    const { roomId } = msgData;
    io.to(roomId).emit("send_message_to_room", msgData);
  });

  socket.on("request_username", (data) => {
    const { querySocketId, roomId } = data;

    const user = getUserName(querySocketId, roomId, roomMembers);

    io.to(roomId).emit("receive_username", {
      username: user.email,
      remoteSocketId: querySocketId,
    });
  });
});
export { app, server, io };
