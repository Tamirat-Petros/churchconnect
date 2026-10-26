import mongoose from "mongoose";
import { Event } from "../models/Event.js";
import { Sermon } from "../models/Sermon.js";
import { PrayerRequest } from "../models/PrayerRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { Announcement } from "../models/Announcement.js";
import { Ministry } from "../models/Ministry.js";
import { EventRegistration } from "../models/EventRegistration.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import {
  announcementSchema,
  eventSchema,
  ministrySchema,
  parseBody,
  registrationStatusSchema,
  reviewStatusSchema,
  sermonSchema
} from "../utils/validation.js";

const collections = {
  events: { model: Event, schema: eventSchema, sort: { date: -1, createdAt: -1 } },
  sermons: { model: Sermon, schema: sermonSchema, sort: { date: -1, createdAt: -1 } },
  announcements: { model: Announcement, schema: announcementSchema, sort: { publishAt: -1, createdAt: -1 } },
  ministries: { model: Ministry, schema: ministrySchema, sort: { name: 1 } }
};

export const overview = asyncHandler(async (_req, res) => {
  const [events, sermons, prayerRequests, contactMessages, announcements, ministries, registrations, unreviewedPrayerRequests, unreviewedContactMessages] = await Promise.all([
    Event.countDocuments(),
    Sermon.countDocuments(),
    PrayerRequest.countDocuments(),
    ContactMessage.countDocuments(),
    Announcement.countDocuments(),
    Ministry.countDocuments(),
    EventRegistration.countDocuments({ status: "registered" }),
    PrayerRequest.countDocuments({ reviewed: false }),
    ContactMessage.countDocuments({ reviewed: false })
  ]);
  res.json({ data: { events, sermons, announcements, ministries, registrations, prayerRequests, contactMessages, unreviewedPrayerRequests, unreviewedContactMessages } });
});

export const listCollection = asyncHandler(async (req, res) => {
  const { model, sort } = getCollection(req.params.collection);
  const records = await model.find().sort(sort).limit(500).lean();
  res.json({ data: records });
});

export const createRecord = asyncHandler(async (req, res) => {
  const { model, schema } = getCollection(req.params.collection);
  const input = parseBody(schema, req.body);
  const record = await model.create(input);
  res.status(201).json({ data: record });
});

export const updateRecord = asyncHandler(async (req, res) => {
  const { model, schema } = getCollection(req.params.collection);
  const input = parseBody(schema, req.body);
  const record = await model.findByIdAndUpdate(validId(req.params.id), input, {
    new: true,
    runValidators: true,
    strict: "throw"
  });
  if (!record) throw new HttpError(404, "Record not found.");
  res.json({ data: record });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const { model } = getCollection(req.params.collection);
  const record = await model.findByIdAndDelete(validId(req.params.id));
  if (!record) throw new HttpError(404, "Record not found.");
  if (req.params.collection === "events") {
    await EventRegistration.deleteMany({ eventId: record._id });
  }
  res.json({ data: { message: "Record deleted." } });
});

export const listPrayerRequests = asyncHandler(async (_req, res) => {
  const messages = await PrayerRequest.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({ data: messages });
});

export const listContactMessages = asyncHandler(async (_req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(500).lean();
  res.json({ data: messages });
});

export const listEventRegistrations = asyncHandler(async (req, res) => {
  const filter = {};
  if (typeof req.query.eventId === "string" && req.query.eventId) {
    filter.eventId = validId(req.query.eventId);
  }
  const registrations = await EventRegistration.find(filter)
    .populate("eventId", "title date location")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  res.json({ data: registrations });
});

export const updateEventRegistration = asyncHandler(async (req, res) => {
  const { status } = parseBody(registrationStatusSchema, req.body);
  const registration = await EventRegistration.findByIdAndUpdate(validId(req.params.id), { status }, {
    new: true,
    runValidators: true,
    strict: "throw"
  }).populate("eventId", "title date location").lean();
  if (!registration) throw new HttpError(404, "Registration not found.");
  res.json({ data: registration });
});

export const deleteEventRegistration = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findByIdAndDelete(validId(req.params.id));
  if (!registration) throw new HttpError(404, "Registration not found.");
  res.json({ data: { message: "Registration deleted." } });
});

export const reviewInboxMessage = asyncHandler(async (req, res) => {
  const models = { "prayer-requests": PrayerRequest, "contact-messages": ContactMessage };
  const model = models[req.params.type];
  if (!model) throw new HttpError(404, "Inbox not found.");
  const input = parseBody(reviewStatusSchema, req.body);
  const message = await model.findByIdAndUpdate(validId(req.params.id), input, {
    new: true,
    runValidators: true,
    strict: "throw"
  }).lean();
  if (!message) throw new HttpError(404, "Message not found.");
  res.json({ data: message });
});

export const deleteInboxMessage = asyncHandler(async (req, res) => {
  const models = { "prayer-requests": PrayerRequest, "contact-messages": ContactMessage };
  const model = models[req.params.type];
  if (!model) throw new HttpError(404, "Inbox not found.");
  const message = await model.findByIdAndDelete(validId(req.params.id));
  if (!message) throw new HttpError(404, "Message not found.");
  res.json({ data: { message: "Message deleted." } });
});

function getCollection(name) {
  const collection = collections[name];
  if (!collection) throw new HttpError(404, "Collection not found.");
  return collection;
}

function validId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid record ID.");
  return id;
}
