import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    preferredLanguage: { type: String, enum: ["en", "am", "om", "ti"], default: "en" },
    city: { type: String, default: "", trim: true, maxlength: 120 },
    householdName: { type: String, default: "", trim: true, maxlength: 120 },
    introduction: { type: String, default: "", trim: true, maxlength: 1200 },
    status: { type: String, enum: ["pending", "contacted", "active", "declined"], default: "pending", index: true },
    reviewedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

memberSchema.index({ status: 1, createdAt: -1 });

export const Member = mongoose.model("Member", memberSchema);
