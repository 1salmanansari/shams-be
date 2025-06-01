import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";

const generateToken = (id: string) => {
    return jwt.sign({ id }, ENV.JWT_SECRET!, {
        expiresIn: "7d",
    });
};

export default generateToken;
