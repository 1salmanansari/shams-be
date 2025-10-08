import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { ENV } from "./config/env";
import i18n from "./i18n/en";
import { logData } from "utils/helper";

const app = express();
const allowedOrigins = ENV.ORIGIN === '*' ? true : ENV.ORIGIN;

// 🛡️ Set security headers
app.use(helmet());

// 🌐 CORS — allow only your frontend origin
app.use(cors({
  origin: allowedOrigins,
  credentials: ENV.ORIGIN !== '*', // Only allow credentials if not wildcard
}));

// 🚫 Block other origins manually (only if not using wildcard)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  logData('Origin', origin)

  // Skip origin check if LOCAL=true or ORIGIN=*
  if (Boolean(ENV.LOCAL) || ENV.ORIGIN === '*') {
    return next();
  }

  if (origin && origin !== ENV.ORIGIN) {
    res.status(403).json({ message: i18n.FAIL_ORIGIN });
    return;
  }

  next();
});

// 🧩 Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 API routes
app.use("/api", router);

// 🛑 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: i18n.FAIL_ROUTE_UNKNOWN });
});

export default app;
