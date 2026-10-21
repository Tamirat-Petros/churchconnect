import { Event } from "../models/Event.js";
import { Sermon } from "../models/Sermon.js";
import { PrayerRequest } from "../models/PrayerRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/async-handler.js";
import { contactMessageSchema, parseBody, prayerRequestSchema } from "../utils/validation.js";

export const listPublicEvents = asyncHandler(async (_req, res) => {
  const events = await Event.find().select("title description date location imageUrl").sort({ date: 1 }).limit(200).lean();
  res.json({ data: events });
});

export const listPublicSermons = asyncHandler(async (req, res) => {
  const query = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 80) : "";
  const filter = query
    ? { $or: [{ title: { $regex: escapeRegex(query), $options: "i" } }, { speaker: { $regex: escapeRegex(query), $options: "i" } }] }
    : {};
  const sermons = await Sermon.find(filter)
    .select("title speaker date description mediaUrl thumbnailUrl")
    .sort({ date: -1 })
    .limit(200)
    .lean();
  res.json({ data: sermons });
});

export const submitPrayerRequest = asyncHandler(async (req, res) => {
  const input = parseBody(prayerRequestSchema, req.body);
  await PrayerRequest.create(input);
  res.status(201).json({ data: { message: "Your prayer request has been received." } });
});

export const submitContactMessage = asyncHandler(async (req, res) => {
  const input = parseBody(contactMessageSchema, req.body);
  await ContactMessage.create(input);
  res.status(201).json({ data: { message: "Thank you for reaching out. We’ll be in touch soon." } });
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
