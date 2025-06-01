import http from "http";
import { Server } from "socket.io";
import app from "@/app";
import connectDB from "@/config/db";
import { socketAuthMiddleware } from "@/middleware/socketAuth.middleware";
import { handleSocketConnection } from "@/socket/events/connection.handler";
import { ENV } from "@/config/env";

const PORT = Number(ENV.PORT) || 4000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: ENV.ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Attach Socket.IO to global scope (or export it from here if needed)
io.use(socketAuthMiddleware);
io.on("connection", handleSocketConnection);

// Connect DB and start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", (error as Error).message);
    process.exit(1);
  }
};

startServer();

// Export io for usage in controllers
export { io };
