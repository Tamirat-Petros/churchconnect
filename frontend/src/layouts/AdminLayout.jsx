import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminApi } from "../services/api.js";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";

const adminLinks = [
  ["/admin", "Overview", true],
  ["/admin/events", "Events"],
  ["/admin/sermons", "Sermons"],
  ["/admin/announcements", "Announcements"],
  ["/admin/ministries", "Ministries"],
  ["/admin/members", "Members"],
  ["/admin/registrations", "Registrations"],
  ["/admin/prayer-requests", "Prayer requests"],
  ["/admin/contact-messages", "Contact messages"]
];

export default function AdminLayout() {
  const [checking, setChecking] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    adminApi.me().then((result) => setAdmin(result.admin)).catch(() => navigate("/admin/login", { replace: true })).finally(() => setChecking(false));
  }, [navigate]);
  async function signOut() {
    setError("");
    try {
      await adminApi.logout();
      navigate("/admin/login", { replace: true });
    } catch (reason) {
      setError(reason.message);
    }
  }
  if (checking) return <div className="admin-loading"><Loading label="Checking your session..." /></div>;
  if (!admin) return null;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin"><img className="brand-emblem" src="/images/grace-community-logo.svg" alt="" /><span><strong>Grace Community</strong><small>CHURCH ADMIN</small></span></Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">{adminLinks.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}</nav>
        <div className="admin-user"><span className="admin-avatar">{admin.email.charAt(0).toUpperCase()}</span><div><strong>{admin.email}</strong><span>Administrator</span></div><button onClick={signOut} type="button" aria-label="Sign out">↗</button></div>
      </aside>
      <main className="admin-main"><div className="admin-mobile-top"><Link to="/admin">Grace Community · Admin</Link><button type="button" onClick={signOut}>Sign out</button></div><nav className="admin-mobile-nav" aria-label="Admin navigation">{adminLinks.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}</nav><ErrorMessage>{error}</ErrorMessage><Outlet /></main>
    </div>
  );
}
