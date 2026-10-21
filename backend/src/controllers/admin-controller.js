import mongoose from "mongoose";
import { Event } from "../models/Event.js";
import { Sermon } from "../models/Sermon.js";
import { PrayerRequest } from "../models/PrayerRequest.js";
import { ContactMessage } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HttpError } from "../utils/http-error.js";
import { contactMessageSchema, eventSchema, parseBody, sermonSchema } from "../utils/validation.js";

const collections = {
  events: { model: Event, schema: eventSchema },
  sermons: { model: Sermon, schema: sermonSchema }
};

export const overview = asyncHandler(async (_req, res) => {
  const [events, sermons, prayerRequests, contactMessages] = await Promise.all([
    Event.countDocuments(),
    Sermon.countDocuments(),
    PrayerRequest.countDocuments(),
    ContactMessage.countDocuments()
  ]);
  res.json({ data: { events, sermons, prayerRequests, contactMessages } });
});

export const listCollection = asyncHandler(async (req, res) => {
  const { model } = getCollection(req.params.collection);
  const records = await model.find().sort({ date: -1, createdAt: -1 }).limit(500).lean();
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

function getCollection(name) {
  const collection = collections[name];
  if (!collection) throw new HttpError(404, "Collection not found.");
  return collection;
}

function validId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, "Invalid record ID.");
  return id;
}
