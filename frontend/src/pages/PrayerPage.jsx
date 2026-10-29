import { useState } from "react";
import { ErrorMessage, FormField, SuccessMessage } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function PrayerPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", careType: "prayer", preferredLanguage: "am", preferredContactMethod: "no-contact", request: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError(""); setSuccess(""); setSubmitting(true);
    try {
      const result = await publicApi.pray(form);
      setSuccess(result.message); setForm({ name: "", email: "", phone: "", careType: "prayer", preferredLanguage: "am", preferredContactMethod: "no-contact", request: "" });
    } catch (reason) { setError(reason.message); }
    finally { setSubmitting(false); }
  }
  return (
    <section className="form-page page-width">
      <div className="form-intro"><p className="eyebrow">A private note to our care team</p><h1>We’re here<br /><em>to listen.</em></h1><p>Whatever you’re carrying, you don’t have to carry it alone. Share as much or as little as you’d like. This message is only visible to our authorized care team.</p><span className="form-promise">Your request will never appear publicly.</span></div>
      <form className="form-card" onSubmit={submit}>
        <h2>Share a prayer request</h2><p className="form-subtitle">Choose the kind of care and language that would be helpful. You can remain anonymous.</p>
        <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
        <FormField label="Your name (optional)" name="name" value={form.name} onChange={update} maxLength="100" />
        <FormField label="How can we support you?" name="careType" as="select" value={form.careType} onChange={update}><option value="prayer">Prayer</option><option value="pastoral-visit">Pastoral visit</option><option value="hospital-visit">Hospital visit</option><option value="counseling">Counseling</option><option value="bereavement">Bereavement support</option><option value="family-support">Family support</option></FormField>
        <FormField label="Preferred language" name="preferredLanguage" as="select" value={form.preferredLanguage} onChange={update}><option value="am">Amharic · አማርኛ</option><option value="en">English</option><option value="om">Afaan Oromo</option><option value="ti">Tigrinya · ትግርኛ</option></FormField>
        <FormField label="Would you like someone to contact you?" name="preferredContactMethod" as="select" value={form.preferredContactMethod} onChange={update}><option value="no-contact">No, prayer only</option><option value="email">Yes, by email</option><option value="phone">Yes, by phone</option></FormField>
        {form.preferredContactMethod === "email" && <FormField label="Email address" name="email" type="email" value={form.email} onChange={update} maxLength="254" required />}
        {form.preferredContactMethod === "phone" && <FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={update} maxLength="40" required />}
        <FormField label="How can we pray for you?" name="request" as="textarea" value={form.request} onChange={update} minLength="10" maxLength="3000" required rows="6" />
        <p className="privacy-note">Prayer and care requests are stored privately and can only be seen by authorized church administrators.</p>
        <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send privately"}</button>
      </form>
    </section>
  );
}
