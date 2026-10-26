import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  listPublicAnnouncements,
  listPublicEvents,
  listPublicMinistries,
  listPublicSermons,
  registerForEvent,
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
router.get("/announcements", listPublicAnnouncements);
router.get("/ministries", listPublicMinistries);
router.post("/events/:eventId/register", submissionLimiter, registerForEvent);
router.post("/prayer-requests", submissionLimiter, submitPrayerRequest);
router.post("/contact-messages", submissionLimiter, submitContactMessage);

export default router;
