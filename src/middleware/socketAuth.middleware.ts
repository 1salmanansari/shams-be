import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) return next(new Error("Missing token"));

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET!);
        (socket as any).user = decoded;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
};
