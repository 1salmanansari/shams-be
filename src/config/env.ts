import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || "4000",
    LOCAL: process.env.LOCAL === "true",
    MONGO_URI: process.env.MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    ORIGIN: process.env.ORIGIN || "*",
};
