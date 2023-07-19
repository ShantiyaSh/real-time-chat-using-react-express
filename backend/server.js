import http from "http";
import { Server } from "socket.io";
import api from "./api.js";
import socket from "./socket.js";

const PORT = 8000;
const httpServer = http.createServer(api);
const socketServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8000",
  },
});

socketServer.listen(4000);
socket(socketServer);
httpServer.listen(PORT)