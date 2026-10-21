import { useState } from "react";
import { ErrorMessage, FormField, SuccessMessage } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function PrayerPage() {
  const [form, setForm] = useState({ name: "", email: "", request: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError(""); setSuccess(""); setSubmitting(true);
    try {
      const result = await publicApi.pray(form);
      setSuccess(result.message); setForm({ name: "", email: "", request: "" });
    } catch (reason) { setError(reason.message); }
    finally { setSubmitting(false); }
  }
  return (
    <section className="form-page page-width">
      <div className="form-intro"><p className="eyebrow">A private note to our care team</p><h1>We’re here<br /><em>to listen.</em></h1><p>Whatever you’re carrying, you don’t have to carry it alone. Share as much or as little as you’d like. This message is only visible to our authorized care team.</p><span className="form-promise">Your request will never appear publicly.</span></div>
      <form className="form-card" onSubmit={submit}>
        <h2>Share a prayer request</h2><p className="form-subtitle">Name and email are optional.</p>
        <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
        <FormField label="Your name (optional)" name="name" value={form.name} onChange={update} maxLength="100" />
        <FormField label="Email (optional)" name="email" type="email" value={form.email} onChange={update} maxLength="254" />
        <FormField label="How can we pray for you?" name="request" as="textarea" value={form.request} onChange={update} minLength="10" maxLength="3000" required rows="6" />
        <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send privately"}</button>
      </form>
    </section>
  );
}
