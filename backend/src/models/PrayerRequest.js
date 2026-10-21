import mongoose from "mongoose";

const prayerRequestSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true, maxlength: 100 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    request: { type: String, required: true, trim: true, maxlength: 3000 },
    reviewed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PrayerRequest = mongoose.model("PrayerRequest", prayerRequestSchema);
