import { useCallback, useEffect, useState } from "react";
import { ErrorMessage, Loading, SuccessMessage } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

export default function AdminRegistrationsPage() {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminApi.records("events").then(setEvents).catch((reason) => setError(reason.message));
  }, []);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");
    try { setRegistrations(await adminApi.registrations(eventId)); }
    catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }, [eventId]);

  useEffect(() => { loadRegistrations(); }, [loadRegistrations]);

  async function updateStatus(item) {
    setError("");
    setSuccess("");
    const status = item.nextStatus;
    try {
      await adminApi.updateRegistration(item._id, status);
      setSuccess(`Registration marked ${status.replaceAll("-", " ")}.`);
      await loadRegistrations();
    } catch (reason) { setError(reason.message); }
  }

  async function remove(item) {
    const eventName = item.eventId?.title || "this event";
    if (!window.confirm(`Permanently delete ${item.name}'s registration for “${eventName}”?`)) return;
    setError("");
    setSuccess("");
    try {
      await adminApi.removeRegistration(item._id);
      setSuccess("Registration deleted.");
      await loadRegistrations();
    } catch (reason) { setError(reason.message); }
  }

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading"><div><p className="eyebrow">EVENT ATTENDANCE</p><h1>Registrations</h1><p>Review sign-ups and attendee counts for upcoming events.</p></div>
        <label className="registration-filter"><span>Filter by event</span><select value={eventId} onChange={(event) => setEventId(event.target.value)}><option value="">All events</option>{events.map((event) => <option value={event._id} key={event._id}>{event.title}</option>)}</select></label>
      </div>
      <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
      {loading ? <Loading label="Loading registrations..." /> : registrations.length ? <div className="admin-table-wrap"><table className="admin-table registrations-table"><thead><tr><th>Event</th><th>Registrant</th><th>Attending</th><th>Status</th><th>Registered</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{registrations.map((item) => <tr key={item._id}>
        <td><strong>{item.eventId?.title || "Event removed"}</strong>{item.eventId?.date && <span className="table-description">{new Date(item.eventId.date).toLocaleString("en-ET", { timeZone: "Africa/Addis_Ababa", dateStyle: "medium", timeStyle: "short" })} EAT</span>}</td>
        <td><strong>{item.name}</strong><span className="table-description"><a href={`mailto:${item.email}`}>{item.email}</a></span>{item.phone && <span className="table-description">{item.phone}</span>}</td>
        <td>{item.attendeeCount}</td>
        <td><span className={`status-pill ${item.status === "registered" || item.status === "attended" ? "status-active" : "status-muted"}`}>{item.status.replaceAll("-", " ")}</span></td>
        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
        <td className="row-actions">{item.status === "registered" ? <><button type="button" onClick={() => updateStatus({ ...item, nextStatus: "attended" })}>Attended</button><button type="button" onClick={() => updateStatus({ ...item, nextStatus: "no-show" })}>No show</button><button type="button" onClick={() => updateStatus({ ...item, nextStatus: "cancelled" })}>Cancel</button></> : <button type="button" onClick={() => updateStatus({ ...item, nextStatus: "registered" })}>Restore</button>}<button className="danger-link" type="button" onClick={() => remove(item)}>Delete</button></td>
      </tr>)}</tbody></table></div> : !error && <div className="empty-state admin-empty"><p>No registrations {eventId ? "for this event" : "yet"}.</p></div>}
    </section>
  );
}
