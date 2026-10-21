import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";

export const authenticateAdmin = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.churchconnect_session;
  if (!token) throw new HttpError(401, "Authentication required.");

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    throw new HttpError(401, "Your session has expired. Please sign in again.");
  }

  const admin = await Admin.findById(payload.sub).select("_id email role");
  if (!admin || admin.role !== "admin") throw new HttpError(401, "Authentication required.");
  req.admin = admin;
  next();
});
