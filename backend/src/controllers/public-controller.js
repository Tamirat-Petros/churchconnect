import mongoose from "mongoose";
import { Event } from "../models/Event.js";
import { Sermon } from "../models/Sermon.js";
import { PrayerRequest } from "../models/PrayerRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { Announcement } from "../models/Announcement.js";
import { Ministry } from "../models/Ministry.js";
import { EventRegistration } from "../models/EventRegistration.js";
import { Member } from "../models/Member.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { contactMessageSchema, eventRegistrationSchema, memberApplicationSchema, parseBody, prayerRequestSchema } from "../utils/validation.js";

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

export const listPublicAnnouncements = asyncHandler(async (_req, res) => {
  const now = new Date();
  const announcements = await Announcement.find({
    isPublished: true,
    publishAt: { $lte: now },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }]
  })
    .select("title content publishAt expiresAt")
    .sort({ publishAt: -1 })
    .limit(100)
    .lean();
  res.json({ data: announcements });
});

export const listPublicMinistries = asyncHandler(async (_req, res) => {
  const ministries = await Ministry.find({ isActive: true })
    .select("name description meetingTime contactEmail imageUrl")
    .sort({ name: 1 })
    .limit(100)
    .lean();
  res.json({ data: ministries });
});

export const registerForEvent = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.eventId)) throw new HttpError(400, "Invalid event ID.");
  const event = await Event.findById(req.params.eventId).select("date title").lean();
  if (!event) throw new HttpError(404, "Event not found.");
  if (new Date(event.date) <= new Date()) throw new HttpError(400, "Registration is closed for this event.");

  const input = parseBody(eventRegistrationSchema, req.body);
  try {
    const existing = await EventRegistration.findOne({ eventId: event._id, email: input.email });
    if (existing?.status === "registered") {
      throw new HttpError(409, "This email is already registered for the event.");
    }
    if (existing) {
      existing.name = input.name;
      existing.email = input.email;
      existing.phone = input.phone ?? "";
      existing.attendeeCount = input.attendeeCount;
      existing.status = "registered";
      await existing.save();
    } else {
      await EventRegistration.create({ ...input, eventId: event._id });
    }
  } catch (error) {
    if (error?.code === 11000) throw new HttpError(409, "This email is already registered for the event.");
    throw error;
  }
  res.status(201).json({ data: { message: `You are registered for ${event.title}.` } });
});

export const submitPrayerRequest = asyncHandler(async (req, res) => {
  const input = parseBody(prayerRequestSchema, req.body);
  await PrayerRequest.create(input);
  res.status(201).json({ data: { message: "Your prayer request has been received." } });
});

export const submitMembershipApplication = asyncHandler(async (req, res) => {
  const input = parseBody(memberApplicationSchema, req.body);
  await Member.create(input);
  res.status(201).json({ data: { message: "Thank you for your interest. Our community team will be in touch." } });
});

export const submitContactMessage = asyncHandler(async (req, res) => {
  const input = parseBody(contactMessageSchema, req.body);
  await ContactMessage.create(input);
  res.status(201).json({ data: { message: "Thank you for reaching out. We’ll be in touch soon." } });
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
