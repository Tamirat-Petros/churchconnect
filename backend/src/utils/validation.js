import { z } from "zod";

const optionalString = (max) => z.string().trim().max(max).optional().or(z.literal(""));

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  date: z.string().datetime(),
  location: z.string().trim().min(2).max(160),
  imageUrl: optionalString(500).refine((value) => !value || /^https?:\/\//i.test(value), "Enter a valid http(s) URL")
});

export const sermonSchema = z.object({
  title: z.string().trim().min(3).max(120),
  speaker: z.string().trim().min(2).max(100),
  date: z.string().datetime(),
  description: z.string().trim().min(10).max(2000),
  mediaUrl: optionalString(500).refine((value) => !value || /^https?:\/\//i.test(value), "Enter a valid http(s) URL"),
  thumbnailUrl: optionalString(500).refine((value) => !value || /^https?:\/\//i.test(value), "Enter a valid http(s) URL")
});

export const announcementSchema = z.object({
  title: z.string().trim().min(3).max(120),
  content: z.string().trim().min(10).max(3000),
  publishAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional().or(z.literal("")),
  isPublished: z.boolean().default(true)
}).refine((value) => !value.expiresAt || !value.publishAt || new Date(value.expiresAt) > new Date(value.publishAt), {
  message: "Expiry must be later than the publish time.",
  path: ["expiresAt"]
});

export const ministrySchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  meetingTime: optionalString(160),
  contactEmail: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  imageUrl: optionalString(500).refine((value) => !value || /^https?:\/\//i.test(value), "Enter a valid http(s) URL"),
  isActive: z.boolean().default(true)
});

export const eventRegistrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  phone: optionalString(40),
  attendeeCount: z.coerce.number().int().min(1).max(10).default(1)
});

export const registrationStatusSchema = z.object({
  status: z.enum(["registered", "cancelled"])
});

export const reviewStatusSchema = z.object({
  reviewed: z.boolean()
});

export const prayerRequestSchema = z.object({
  name: optionalString(100),
  email: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  request: z.string().trim().min(10).max(3000)
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(3000)
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128)
});

export function parseBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const error = new Error("Please check the submitted fields.");
    error.status = 400;
    error.details = result.error.flatten().fieldErrors;
    throw error;
  }
  return result.data;
}
