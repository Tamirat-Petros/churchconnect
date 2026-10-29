import { useState } from "react";
import { ErrorMessage, FormField, SuccessMessage } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

const blankForm = { fullName: "", email: "", phone: "", preferredLanguage: "am", city: "", householdName: "", introduction: "" };

export default function JoinPage() {
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setError(""); setSuccess(""); setSubmitting(true);
    try {
      const result = await publicApi.applyMembership(form);
      setSuccess(result.message); setForm(blankForm);
    } catch (reason) { setError(reason.message); }
    finally { setSubmitting(false); }
  }
  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">Find your place in the community</p><h1>Belonging<br /><em>starts with hello.</em></h1><p>Whether you’re new to Addis Ababa or have called this community home for years, we’d love to meet you. Share a few details and our welcome team will reach out.</p></section>
      <section className="form-page page-width join-page">
        <div className="form-intro"><p className="eyebrow">Take a next step</p><h2>There’s room<br /><em>for you here.</em></h2><p>This is a request to connect with the church community, not a commitment. You can tell us what kind of introduction or support would feel helpful.</p><div className="join-promise"><span aria-hidden="true">✳</span><div><strong>Your details stay with our church team.</strong><p>We use this information only to follow up about your request. It is not displayed publicly.</p></div></div></div>
        <form className="form-card" onSubmit={submit}>
          <p className="eyebrow">A warm welcome</p><h2>Tell us a little about yourself</h2><p className="form-subtitle">Name and one way to contact you are needed.</p>
          <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
          <div className="join-form-grid">
            <FormField label="Your name" name="fullName" value={form.fullName} onChange={update} required minLength="2" maxLength="100" />
            <FormField label="Preferred language" name="preferredLanguage" as="select" value={form.preferredLanguage} onChange={update}><option value="am">Amharic · አማርኛ</option><option value="en">English</option><option value="om">Afaan Oromo</option><option value="ti">Tigrinya · ትግርኛ</option></FormField>
            <FormField label="Email address (optional if phone is provided)" name="email" type="email" value={form.email} onChange={update} maxLength="254" />
            <FormField label="Phone number (optional if email is provided)" name="phone" type="tel" value={form.phone} onChange={update} maxLength="40" />
            <FormField label="City or neighborhood (optional)" name="city" value={form.city} onChange={update} maxLength="120" placeholder="e.g. Bole, Addis Ababa" />
            <FormField label="Household or family name (optional)" name="householdName" value={form.householdName} onChange={update} maxLength="120" />
          </div>
          <FormField label="What would you like us to know? (optional)" name="introduction" as="textarea" value={form.introduction} onChange={update} maxLength="1200" rows="4" placeholder="A little about what brought you here, or how we can help you feel at home." />
          <button className="button button-dark" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Connect with the community →"}</button>
        </form>
      </section>
    </>
  );
}
