import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const links = [
  ["/about", "Our story"],
  ["/events", "Events"],
  ["/sermons", "Messages"],
  ["/contact", "Contact"]
];

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Grace Community Church home" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden="true">g</span>
            <span><strong>Grace Community</strong><small>CHURCH · RIVERDALE</small></span>
          </Link>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
            <Link className="button button-small" to="/prayer" onClick={() => setMenuOpen(false)}>Prayer request</Link>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <Link className="brand brand-light" to="/">
              <span className="brand-mark" aria-hidden="true">g</span>
              <span><strong>Grace Community</strong><small>CHURCH · RIVERDALE</small></span>
            </Link>
            <p>A place to find belonging, purpose, and room to grow.</p>
          </div>
          <div className="footer-details">
            <p><strong>Sunday worship</strong><br />10:00 am · 24 Willow Street, Riverdale</p>
            <p><a href="mailto:hello@gracecommunity.example">hello@gracecommunity.example</a><br /><a href="tel:+15550142000">(555) 014-2000</a></p>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Grace Community Church</span><Link to="/admin/login">Administrator sign in</Link></div>
      </footer>
    </>
  );
}
