import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true, trim: true, maxlength: 3000 },
    publishAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: true, index: true },
    sampleKey: { type: String, unique: true, sparse: true, select: false }
  },
  { timestamps: true }
);

announcementSchema.index({ isPublished: 1, publishAt: -1, expiresAt: 1 });

export const Announcement = mongoose.model("Announcement", announcementSchema);
