import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { adminApi } from "../services/api.js";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";

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
        <Link className="admin-brand" to="/admin"><span className="brand-mark" aria-hidden="true">g</span><span><strong>Grace Community</strong><small>CHURCH ADMIN</small></span></Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">
          <NavLink to="/admin" end>Overview</NavLink>
          <NavLink to="/admin/events">Events</NavLink>
          <NavLink to="/admin/sermons">Sermons</NavLink>
          <NavLink to="/admin/prayer-requests">Prayer requests</NavLink>
          <NavLink to="/admin/contact-messages">Contact messages</NavLink>
        </nav>
        <div className="admin-user"><span className="admin-avatar">{admin.email.charAt(0).toUpperCase()}</span><div><strong>{admin.email}</strong><span>Administrator</span></div><button onClick={signOut} type="button" aria-label="Sign out">↗</button></div>
      </aside>
      <main className="admin-main"><div className="admin-mobile-top"><Link to="/admin">Grace Community · Admin</Link><button type="button" onClick={signOut}>Sign out</button></div><ErrorMessage>{error}</ErrorMessage><Outlet /></main>
    </div>
  );
}
