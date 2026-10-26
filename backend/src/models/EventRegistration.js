import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, default: "", trim: true, maxlength: 40 },
    attendeeCount: { type: Number, required: true, min: 1, max: 10, default: 1 },
    status: { type: String, enum: ["registered", "cancelled"], default: "registered", index: true }
  },
  { timestamps: true }
);

eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });
eventRegistrationSchema.index({ eventId: 1, status: 1, createdAt: -1 });

export const EventRegistration = mongoose.model("EventRegistration", eventRegistrationSchema);
