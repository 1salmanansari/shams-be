import { Socket } from "socket.io";

export default function registerUserHandlers(socket: Socket) {
    socket.on("user:ping", (payload) => {
        console.log("👋 user:ping", payload);
        socket.emit("user:pong", { msg: "Pong from server", at: Date.now() });
    });
}
