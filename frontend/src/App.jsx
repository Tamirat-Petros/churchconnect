import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AnnouncementsPage from "./pages/AnnouncementsPage.jsx";
import AdminContentPage from "./pages/AdminContentPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminInboxPage from "./pages/AdminInboxPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminRegistrationsPage from "./pages/AdminRegistrationsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MinistriesPage from "./pages/MinistriesPage.jsx";
import PrayerPage from "./pages/PrayerPage.jsx";
import SermonsPage from "./pages/SermonsPage.jsx";

function NotFoundPage() {
  return <section className="page-hero page-width"><p className="eyebrow">404 · PAGE NOT FOUND</p><h1>Let’s find<br /><em>our way back.</em></h1><a className="button button-dark" href="/">Back to home</a></section>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path=":collection" element={<AdminContentPage />} />
        <Route path="prayer-requests" element={<AdminInboxPage />} />
        <Route path="contact-messages" element={<AdminInboxPage />} />
      </Route>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="sermons" element={<SermonsPage />} />
        <Route path="ministries" element={<MinistriesPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="prayer" element={<PrayerPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
