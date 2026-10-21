import { Router } from "express";
import rateLimit from "express-rate-limit";
import { currentAdmin, login, logout } from "../controllers/auth-controller.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Please try again later." }
});

router.post("/login", loginLimiter, asyncHandler(login));
router.post("/logout", authenticateAdmin, asyncHandler(logout));
router.get("/me", authenticateAdmin, currentAdmin);

export default router;
