import { useState } from "react";
import { ErrorMessage, FormField, SuccessMessage } from "./Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function EventRegistrationForm({ eventId }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", attendeeCount: "1" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const result = await publicApi.registerForEvent(eventId, { ...form, attendeeCount: Number(form.attendeeCount) });
      setSuccess(result.message || "You’re registered. We look forward to seeing you.");
      setForm({ name: "", email: "", phone: "", attendeeCount: "1" });
    } catch (reason) {
      setError(reason.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="event-signup">
      <button className="text-link" type="button" aria-expanded={open} onClick={() => { setOpen(!open); setError(""); }}>{open ? "Close registration" : "Register for this event"} <span aria-hidden="true">{open ? "−" : "→"}</span></button>
      {open && <form className="event-signup-form" onSubmit={submit}>
        <p className="signup-note">Register up to 10 people. Your email can be used once for this event.</p>
        <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
        <FormField label="Your name" name={`event-name-${eventId}`} value={form.name} minLength="2" maxLength="100" required onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <FormField label="Email address" name={`event-email-${eventId}`} type="email" value={form.email} maxLength="254" required onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <FormField label="Phone (optional)" name={`event-phone-${eventId}`} type="tel" value={form.phone} maxLength="40" onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <FormField label="Number attending" name={`event-count-${eventId}`} as="select" value={form.attendeeCount} onChange={(event) => setForm({ ...form, attendeeCount: event.target.value })}>
          {Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}
        </FormField>
        <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Registering..." : "Confirm registration"}</button>
      </form>}
    </section>
  );
}
