import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "@/routes";
import { ENV } from "@/config/env";

const app = express();

// 🛡️ Set security headers
app.use(helmet());

// 🌐 CORS — allow only your frontend origin
app.use(cors({
  origin: ENV.ORIGIN,
  credentials: true,
}));

// 🚫 Block other origins manually
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!Boolean(ENV.LOCAL) && origin && origin !== ENV.ORIGIN) {
    res.status(403).json({ message: "Forbidden origin" });
    return; // ✅ explicitly exit
  }

  next(); // ✅ no return here
});

// 🧩 Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 API routes
app.use("/api", router);

// 🛑 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
