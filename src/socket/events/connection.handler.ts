import { Socket } from "socket.io";
import registerUserHandlers from "./user.handler";

export const handleSocketConnection = (socket: Socket) => {
    const user = (socket as any).user;
    console.log("✅ Socket connected:", socket.id, "User:", user?.id || "unknown");

    // 🧩 Register all modules
    registerUserHandlers(socket);

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
};
