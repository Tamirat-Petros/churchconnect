import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth-routes.js";
import publicRoutes from "./routes/public-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import { HttpError } from "./utils/http-error.js";

export const app = express();
const allowedOrigins = new Set([env.CLIENT_URL]);

app.disable("x-powered-by");
app.set("trust proxy", env.NODE_ENV === "production" ? 1 : false);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new HttpError(403, "Origin is not allowed."));
  },
  credentials: true
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ data: { status: connected ? "ok" : "unavailable" } });
});
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use((req, _res, next) => next(new HttpError(404, `Route not found: ${req.method} ${req.path}`)));
app.use((error, _req, res, _next) => {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error("Request failed:", error.message);
  res.status(status).json({
    error: status >= 500 ? "An unexpected server error occurred." : error.message,
    ...(error.details ? { details: error.details } : {})
  });
});
