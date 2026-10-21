import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  listPublicEvents,
  listPublicSermons,
  submitContactMessage,
  submitPrayerRequest
} from "../controllers/public-controller.js";

const router = Router();
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." }
});

router.get("/events", listPublicEvents);
router.get("/sermons", listPublicSermons);
router.post("/prayer-requests", submissionLimiter, submitPrayerRequest);
router.post("/contact-messages", submissionLimiter, submitContactMessage);

export default router;
