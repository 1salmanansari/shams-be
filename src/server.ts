import http from "http";
import { Server } from "socket.io";
import app from "./app";
import connectDB from "./config/db";
import { socketAuthMiddleware } from "./middleware/socketAuth.middleware";
import { handleSocketConnection } from "./socket/events/connection.handler";
import { ENV } from "./config/env";

const PORT = Number(ENV.PORT) || 4000;
const HOST = '0.0.0.0'; // Bind to all interfaces

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

// Attach Socket.IO middleware and handlers
io.use(socketAuthMiddleware);
io.on("connection", handleSocketConnection);

// Connect DB and start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", (error as Error).message);
    process.exit(1);
  }
};

startServer();

// Export io for usage in controllers
export { io };