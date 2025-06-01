import http from "http";
import { Server } from "socket.io";
import app from "@/app";
import connectDB from "@/config/db"; // 👈 Add this
import { socketAuthMiddleware } from "@/middleware/socketAuth.middleware";
import { handleSocketConnection } from "@/socket/events/connection.handler";
import { ENV } from "@/config/env";

const PORT = Number(ENV.PORT);
const server = http.createServer(app);

// 👇 Connect to MongoDB BEFORE starting the server
const io = new Server(server, {
  cors: {
    origin: ENV.ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.use(socketAuthMiddleware);
io.on("connection", handleSocketConnection);
connectDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
