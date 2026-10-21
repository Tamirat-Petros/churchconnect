import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    imageUrl: { type: String, default: "" },
    sampleKey: { type: String, unique: true, sparse: true, select: false }
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
