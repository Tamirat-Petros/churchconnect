import mongoose from "mongoose";

const ministrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    meetingTime: { type: String, default: "", trim: true, maxlength: 160 },
    contactEmail: { type: String, default: "", trim: true, lowercase: true, maxlength: 254 },
    imageUrl: { type: String, default: "", trim: true, maxlength: 500 },
    isActive: { type: Boolean, default: true, index: true },
    sampleKey: { type: String, unique: true, sparse: true, select: false }
  },
  { timestamps: true }
);

ministrySchema.index({ isActive: 1, name: 1 });

export const Ministry = mongoose.model("Ministry", ministrySchema);
