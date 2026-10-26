import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.js";
import {
  createRecord,
  deleteEventRegistration,
  deleteInboxMessage,
  deleteRecord,
  listEventRegistrations,
  listCollection,
  listContactMessages,
  listPrayerRequests,
  overview,
  reviewInboxMessage,
  updateEventRegistration,
  updateRecord
} from "../controllers/admin-controller.js";

const router = Router();
router.use(authenticateAdmin);
router.get("/overview", overview);
router.get("/prayer-requests", listPrayerRequests);
router.get("/contact-messages", listContactMessages);
router.patch("/inbox/:type/:id/review", reviewInboxMessage);
router.get("/registrations", listEventRegistrations);
router.patch("/registrations/:id", updateEventRegistration);
router.delete("/registrations/:id", deleteEventRegistration);
router.delete("/inbox/:type/:id", deleteInboxMessage);
router.get("/:collection", listCollection);
router.post("/:collection", createRecord);
router.put("/:collection/:id", updateRecord);
router.delete("/:collection/:id", deleteRecord);

export default router;
