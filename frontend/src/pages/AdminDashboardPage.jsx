import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

const cards = [
  ["events", "Events", "/admin/events", "Calendar"],
  ["sermons", "Sermons", "/admin/sermons", "Messages"],
  ["prayerRequests", "Prayer requests", "/admin/prayer-requests", "Private inbox"],
  ["contactMessages", "Contact messages", "/admin/contact-messages", "Inbox"]
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    adminApi.overview().then(setCounts).catch((reason) => setError(reason.message));
  }, []);
  return (
    <section className="dashboard-page">
      <div className="admin-page-heading"><div><p className="eyebrow">YOUR CHURCH AT A GLANCE</p><h1>Good morning.</h1><p>Here’s what’s happening across your website.</p></div><Link className="button button-dark" to="/">View public site ↗</Link></div>
      <ErrorMessage>{error}</ErrorMessage>
      {!counts && !error ? <Loading label="Loading your overview..." /> : counts && <div className="stats-grid">{cards.map(([key, label, to, icon]) => <Link className="stat-card" to={to} key={key}><span className="stat-icon">{icon}</span><span className="stat-number">{counts[key]}</span><span className="stat-label">{label}</span><span className="stat-arrow" aria-hidden="true">↗</span></Link>)}</div>}
      <div className="dashboard-note"><span className="note-icon" aria-hidden="true">✳</span><div><p className="eyebrow">A gentle reminder</p><h2>Small updates make a big difference.</h2><p>Keep upcoming events and recent messages fresh so your community knows what’s happening.</p></div><Link className="text-link" to="/admin/events">Manage events →</Link></div>
    </section>
  );
}
