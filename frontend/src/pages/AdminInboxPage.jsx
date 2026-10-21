import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

function MessageCard({ item, type }) {
  return (
    <article className="inbox-card">
      <div className="inbox-card-top"><div><p className="eyebrow">{new Date(item.createdAt).toLocaleString()}</p><h2>{type === "prayer" ? item.name || "Shared anonymously" : item.name}</h2></div>{item.email && <a className="text-link" href={`mailto:${item.email}`}>{item.email} ↗</a>}</div>
      {type === "contact" && <h3 className="inbox-subject">{item.subject}</h3>}
      <p className="inbox-message">{type === "prayer" ? item.request : item.message}</p>
    </article>
  );
}

export default function AdminInboxPage() {
  const location = useLocation();
  const isPrayer = location.pathname.endsWith("prayer-requests");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    (isPrayer ? adminApi.prayerRequests() : adminApi.contactMessages())
      .then(setItems).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, [isPrayer]);
  return (
    <section className="admin-list-page">
      <div className="admin-page-heading"><div><p className="eyebrow">PRIVATE INBOX</p><h1>{isPrayer ? "Prayer requests" : "Contact messages"}</h1><p>{isPrayer ? "These messages are visible only to authorized administrators." : "Notes and questions sent through the public website."}</p></div></div>
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? <Loading label="Loading messages..." /> : items.length ? <div className="inbox-list">{items.map((item) => <MessageCard item={item} type={isPrayer ? "prayer" : "contact"} key={item._id} />)}</div> : !error && <p className="empty-state">There are no messages here yet.</p>}
    </section>
  );
}
