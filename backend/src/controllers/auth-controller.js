import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { env } from "../config/env.js";
import { loginSchema, parseBody } from "../utils/validation.js";
import { HttpError } from "../utils/http-error.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 8 * 60 * 60 * 1000
};

export async function login(req, res) {
  const input = parseBody(loginSchema, req.body);
  const admin = await Admin.findOne({ email: input.email.toLowerCase() }).select("+passwordHash");
  const validPassword = admin && await bcrypt.compare(input.password, admin.passwordHash);
  if (!validPassword) throw new HttpError(401, "Email or password is incorrect.");

  const token = jwt.sign(
    { sub: admin.id, role: admin.role },
    env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "8h" }
  );
  res.cookie("churchconnect_session", token, cookieOptions);
  res.json({ data: { admin: { id: admin.id, email: admin.email } } });
}

export function logout(_req, res) {
  res.clearCookie("churchconnect_session", { ...cookieOptions, maxAge: undefined });
  res.json({ data: { message: "Signed out." } });
}

export function currentAdmin(req, res) {
  res.json({ data: { admin: { id: req.admin.id, email: req.admin.email } } });
}
