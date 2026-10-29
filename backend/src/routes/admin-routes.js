import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.js";
import {
  createRecord,
  deleteMember,
  deleteEventRegistration,
  deleteInboxMessage,
  deleteRecord,
  listEventRegistrations,
  listCollection,
  listContactMessages,
  listMembers,
  listPrayerRequests,
  overview,
  reviewInboxMessage,
  updateEventRegistration,
  updateMemberStatus,
  updateRecord
} from "../controllers/admin-controller.js";

const router = Router();
router.use(authenticateAdmin);
router.get("/overview", overview);
router.get("/prayer-requests", listPrayerRequests);
router.get("/contact-messages", listContactMessages);
router.get("/members", listMembers);
router.patch("/members/:id", updateMemberStatus);
router.delete("/members/:id", deleteMember);
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
