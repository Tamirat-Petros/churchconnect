import { Router } from "express";
import { authenticateAdmin } from "../middleware/auth.js";
import {
  createRecord,
  deleteRecord,
  listCollection,
  listContactMessages,
  listPrayerRequests,
  overview,
  updateRecord
} from "../controllers/admin-controller.js";

const router = Router();
router.use(authenticateAdmin);
router.get("/overview", overview);
router.get("/prayer-requests", listPrayerRequests);
router.get("/contact-messages", listContactMessages);
router.get("/:collection", listCollection);
router.post("/:collection", createRecord);
router.put("/:collection/:id", updateRecord);
router.delete("/:collection/:id", deleteRecord);

export default router;
