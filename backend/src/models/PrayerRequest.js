import mongoose from "mongoose";

const prayerRequestSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true, maxlength: 100 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    careType: { type: String, enum: ["prayer", "pastoral-visit", "hospital-visit", "counseling", "bereavement", "family-support"], default: "prayer" },
    preferredLanguage: { type: String, enum: ["en", "am", "om", "ti"], default: "en" },
    preferredContactMethod: { type: String, enum: ["no-contact", "email", "phone"], default: "no-contact" },
    request: { type: String, required: true, trim: true, maxlength: 3000 },
    reviewed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PrayerRequest = mongoose.model("PrayerRequest", prayerRequestSchema);
