import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { ENV } from "./config/env";
import i18n from "./i18n/en";

const app = express();

// 🛡️ Set security headers
app.use(helmet());

// 🌐 CORS — allow only your frontend origin
app.use(cors({
  origin: ENV.ORIGIN,
  credentials: true,
}));

// 🚫 Block other origins manually
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (!Boolean(ENV.LOCAL) && origin && origin !== ENV.ORIGIN) {
//     res.status(403).json({ message: i18n.FAIL_ORIGIN });
//     return; // ✅ explicitly exit
//   }

//   next(); // ✅ no return here
// });

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
