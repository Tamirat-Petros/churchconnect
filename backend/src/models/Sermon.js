import mongoose from "mongoose";

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    speaker: { type: String, required: true, trim: true, maxlength: 100 },
    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    mediaUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    sampleKey: { type: String, unique: true, sparse: true, select: false }
  },
  { timestamps: true }
);

export const Sermon = mongoose.model("Sermon", sermonSchema);
