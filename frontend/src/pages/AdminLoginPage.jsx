import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, FormField } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      await adminApi.login({ email, password });
      navigate("/admin", { replace: true });
    } catch (reason) { setError(reason.message); }
    finally { setSubmitting(false); }
  }
  return (
    <main className="login-page">
      <section className="login-card">
        <Link className="brand" to="/"><span className="brand-mark" aria-hidden="true">g</span><span><strong>Grace Community</strong><small>CHURCH · RIVERDALE</small></span></Link>
        <p className="eyebrow">ADMINISTRATOR ACCESS</p><h1>Welcome back.</h1><p className="login-copy">Sign in to manage the church website and messages.</p>
        <form onSubmit={submit}>
          <ErrorMessage>{error}</ErrorMessage>
          <FormField label="Email address" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <FormField label="Password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="button button-dark button-wide" type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Sign in securely"}</button>
        </form>
        <Link className="login-back" to="/">← Back to the church website</Link>
      </section>
    </main>
  );
}
