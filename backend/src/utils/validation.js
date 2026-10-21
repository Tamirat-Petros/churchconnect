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
