import { useState } from "react";
import { ErrorMessage, FormField, SuccessMessage } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError(""); setSuccess(""); setSubmitting(true);
    try {
      const result = await publicApi.contact(form);
      setSuccess(result.message); setForm({ name: "", email: "", subject: "", message: "" });
    } catch (reason) { setError(reason.message); }
    finally { setSubmitting(false); }
  }
  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">We’d love to hear from you</p><h1>Say hello.<br /><em>Ask anything.</em></h1><p>Planning a visit, looking for directions, or just have a question? We’re happy to help.</p></section>
      <section className="contact-layout page-width">
        <aside className="contact-details">
          <div><p className="eyebrow">Come by</p><h2>Find us in<br />the neighborhood.</h2><p>24 Willow Street<br />Riverdale, NY 10001</p><a className="text-link" href="https://maps.google.com/?q=24+Willow+Street+Riverdale" target="_blank" rel="noreferrer">Open map <span aria-hidden="true">↗</span></a></div>
          <div><p className="eyebrow">Gather with us</p><p><strong>Sunday worship</strong><br />10:00 am · All ages welcome</p><p><strong>Office hours</strong><br />Tuesday–Thursday, 9:00 am–3:00 pm</p></div>
          <div><p className="eyebrow">Reach out</p><p><a href="mailto:hello@gracecommunity.example">hello@gracecommunity.example</a><br /><a href="tel:+15550142000">(555) 014-2000</a></p></div>
        </aside>
        <form className="form-card" onSubmit={submit}>
          <h2>Send us a note</h2><ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
          <FormField label="Your name" name="name" value={form.name} onChange={update} required minLength="2" maxLength="100" />
          <FormField label="Email address" name="email" type="email" value={form.email} onChange={update} required maxLength="254" />
          <FormField label="Subject" name="subject" value={form.subject} onChange={update} required minLength="3" maxLength="160" />
          <FormField label="Your message" name="message" as="textarea" value={form.message} onChange={update} required minLength="10" maxLength="3000" rows="5" />
          <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send message"}</button>
        </form>
      </section>
    </>
  );
}
