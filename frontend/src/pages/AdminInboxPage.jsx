import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ErrorMessage, Loading, SuccessMessage } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

function MessageCard({ item, type, onReview, onDelete, busy }) {
  return (
    <article className="inbox-card">
      <div className="inbox-card-top"><div><p className="eyebrow">{new Date(item.createdAt).toLocaleString()}</p><h2>{type === "prayer" ? item.name || "Shared anonymously" : item.name}</h2><span className={`status-pill ${item.reviewed ? "status-muted" : "status-active"}`}>{item.reviewed ? "Reviewed" : "New"}</span></div>{item.email && <a className="text-link" href={`mailto:${item.email}`}>{item.email} ↗</a>}</div>
      {type === "contact" && <h3 className="inbox-subject">{item.subject}</h3>}
      <p className="inbox-message">{type === "prayer" ? item.request : item.message}</p>
      <div className="inbox-actions"><button className="text-link" type="button" disabled={busy} onClick={() => onReview(item)}>{item.reviewed ? "Mark as new" : "Mark reviewed"}</button><button className="danger-link" type="button" disabled={busy} onClick={() => onDelete(item)}>Delete</button></div>
    </article>
  );
}

export default function AdminInboxPage() {
  const location = useLocation();
  const isPrayer = location.pathname.endsWith("prayer-requests");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState("");
  useEffect(() => {
    setLoading(true);
    setError("");
    (isPrayer ? adminApi.prayerRequests() : adminApi.contactMessages())
      .then(setItems).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, [isPrayer]);

  const type = isPrayer ? "prayer-requests" : "contact-messages";
  async function review(item) {
    setBusyId(item._id); setError(""); setSuccess("");
    try {
      const updated = await adminApi.reviewInbox(type, item._id, !item.reviewed);
      setItems((current) => current.map((entry) => entry._id === updated._id ? updated : entry));
      setSuccess(updated.reviewed ? "Message marked reviewed." : "Message marked as new.");
    } catch (reason) { setError(reason.message); }
    finally { setBusyId(""); }
  }

  async function remove(item) {
    if (!window.confirm("Delete this message permanently? This cannot be undone.")) return;
    setBusyId(item._id); setError(""); setSuccess("");
    try {
      await adminApi.removeInboxMessage(type, item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      setSuccess("Message deleted.");
    } catch (reason) { setError(reason.message); }
    finally { setBusyId(""); }
  }
  return (
    <section className="admin-list-page">
      <div className="admin-page-heading"><div><p className="eyebrow">PRIVATE INBOX</p><h1>{isPrayer ? "Prayer requests" : "Contact messages"}</h1><p>{isPrayer ? "These messages are visible only to authorized administrators." : "Notes and questions sent through the public website."}</p></div></div>
      <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
      {loading ? <Loading label="Loading messages..." /> : items.length ? <div className="inbox-list">{items.map((item) => <MessageCard item={item} type={isPrayer ? "prayer" : "contact"} key={item._id} busy={busyId === item._id} onReview={review} onDelete={remove} />)}</div> : !error && <p className="empty-state">There are no messages here yet.</p>}
    </section>
  );
}
