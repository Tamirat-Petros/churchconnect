import { useEffect, useState } from "react";
import { AnnouncementCard } from "../components/ContentCards.jsx";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    publicApi.announcements()
      .then(setAnnouncements)
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">Notes from our community</p><h1>What’s<br /><em>happening.</em></h1><p>News, reminders, and ways to stay connected at Grace Community.</p></section>
      <section className="page-width listing-section">
        {loading ? <Loading label="Loading announcements..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : announcements.length ? <div className="announcement-list">{announcements.map((item) => <AnnouncementCard announcement={item} key={item._id} />)}</div> : <p className="empty-state">There are no current announcements. Please check back soon.</p>}
      </section>
    </>
  );
}
