import test from "node:test";
import assert from "node:assert/strict";
import { contactMessageSchema, eventSchema, prayerRequestSchema, sermonSchema } from "../src/utils/validation.js";

test("event requires a valid future-or-past ISO date and required details", () => {
  const valid = eventSchema.safeParse({
    title: "Community lunch",
    description: "Share a meal and meet your neighbors.",
    date: "2027-01-12T12:00:00.000Z",
    location: "Church hall"
  });
  assert.equal(valid.success, true);
  assert.equal(eventSchema.safeParse({ title: "x" }).success, false);
});

test("sermon rejects non-http media URLs", () => {
  const result = sermonSchema.safeParse({
    title: "A good word",
    speaker: "Pastor Lena",
    date: "2027-01-12T12:00:00.000Z",
    description: "A thoughtful reflection for the whole community.",
    mediaUrl: "javascript:alert(1)"
  });
  assert.equal(result.success, false);
});

test("prayer request is private-form input with required request text", () => {
  assert.equal(prayerRequestSchema.safeParse({ request: "Please pray for our family." }).success, true);
  assert.equal(prayerRequestSchema.safeParse({ request: "short" }).success, false);
});

test("contact form validates email and message fields", () => {
  assert.equal(contactMessageSchema.safeParse({
    name: "Alex Taylor",
    email: "alex@example.org",
    subject: "Visiting Sunday",
    message: "Could you share a little more about the Sunday service?"
  }).success, true);
  assert.equal(contactMessageSchema.safeParse({
    name: "Alex Taylor",
    email: "not-an-email",
    subject: "Hi",
    message: "Could you share more about the service?"
  }).success, false);
});
