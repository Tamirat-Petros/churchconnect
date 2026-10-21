import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessage, FormField, Loading, SuccessMessage } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

function emptyForm(collection) {
  return collection === "events"
    ? { title: "", description: "", date: "", location: "", imageUrl: "" }
    : { title: "", speaker: "", date: "", description: "", mediaUrl: "", thumbnailUrl: "" };
}

function inputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function AdminCollectionPage() {
  const { collection } = useParams();
  const isEvents = collection === "events";
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm(collection));
  const [editing, setEditing] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRecords = useCallback(async () => {
    setError(""); setLoading(true);
    try { setRecords(await adminApi.records(collection)); }
    catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }, [collection]);

  useEffect(() => { setForm(emptyForm(collection)); setEditing(""); setShowForm(false); loadRecords(); }, [collection, loadRecords]);

  function startEdit(record) {
    setEditing(record._id);
    setForm({ ...emptyForm(collection), ...record, date: inputDate(record.date) });
    setShowForm(true); setError(""); setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCreate() {
    setEditing(""); setForm(emptyForm(collection)); setShowForm(true); setError(""); setSuccess("");
  }

  function cancelEdit() {
    setEditing(""); setForm(emptyForm(collection)); setShowForm(false); setError("");
  }

  async function save(event) {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    const data = { ...form, date: new Date(form.date).toISOString() };
    try {
      if (editing) await adminApi.update(collection, editing, data);
      else await adminApi.create(collection, data);
      setSuccess(editing ? "Your changes have been saved." : `${isEvents ? "Event" : "Sermon"} added.`);
      cancelEdit();
      await loadRecords();
    } catch (reason) { setError(reason.message); }
    finally { setSaving(false); }
  }

  async function remove(record) {
    if (!window.confirm(`Delete “${record.title}”? This cannot be undone.`)) return;
    setError(""); setSuccess("");
    try {
      await adminApi.remove(collection, record._id);
      setSuccess(`${isEvents ? "Event" : "Sermon"} deleted.`);
      await loadRecords();
    } catch (reason) { setError(reason.message); }
  }

  const fields = isEvents
    ? [["title", "Event title", "text", true], ["date", "Date and time", "datetime-local", true], ["location", "Location", "text", true], ["imageUrl", "Image URL (optional)", "url", false], ["description", "Description", "textarea", true]]
    : [["title", "Sermon title", "text", true], ["speaker", "Speaker", "text", true], ["date", "Date", "datetime-local", true], ["mediaUrl", "External video or audio URL (optional)", "url", false], ["thumbnailUrl", "Thumbnail URL (optional)", "url", false], ["description", "Description", "textarea", true]];

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading"><div><p className="eyebrow">CONTENT MANAGEMENT</p><h1>{isEvents ? "Events" : "Sermons"}</h1><p>{isEvents ? "Keep the community in the loop about what’s coming up." : "Share thoughtful messages with your community."}</p></div><button className="button button-dark" type="button" onClick={startCreate}>＋ Add {isEvents ? "event" : "sermon"}</button></div>
      <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
      {showForm && <form className="admin-form-card" onSubmit={save}><div className="admin-form-heading"><div><p className="eyebrow">{editing ? "UPDATE CONTENT" : "NEW CONTENT"}</p><h2>{editing ? "Make an update" : `Add a ${isEvents ? "new event" : "new sermon"}`}</h2></div><button className="icon-button" type="button" onClick={cancelEdit} aria-label="Close form">×</button></div>
        <div className="admin-form-grid">{fields.map(([name, label, type, required]) => <FormField key={name} label={label} name={name} as={type === "textarea" ? "textarea" : "input"} type={type === "textarea" ? undefined : type} required={required} minLength={required ? (name === "title" ? 3 : 2) : undefined} maxLength={name === "description" ? 2000 : 500} rows={type === "textarea" ? 4 : undefined} value={form[name] || ""} onChange={(event) => setForm({ ...form, [name]: event.target.value })} />)}</div>
        <div className="form-actions"><button className="button button-dark" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : `Create ${isEvents ? "event" : "sermon"}`}</button><button className="button button-muted" type="button" onClick={cancelEdit}>Cancel</button></div>
      </form>}
      {loading ? <Loading label="Loading content..." /> : records.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Title</th><th>{isEvents ? "Date & location" : "Speaker"}</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{records.map((record) => <tr key={record._id}><td><strong>{record.title}</strong><span className="table-description">{record.description}</span></td><td>{isEvents ? <>{new Date(record.date).toLocaleDateString()}<span className="table-description">{record.location}</span></> : record.speaker}</td><td>{new Date(record.updatedAt).toLocaleDateString()}</td><td className="row-actions"><button type="button" onClick={() => startEdit(record)}>Edit</button><button className="danger-link" type="button" onClick={() => remove(record)}>Delete</button></td></tr>)}</tbody></table></div> : !error && <div className="empty-state admin-empty"><p>No {isEvents ? "events" : "sermons"} yet.</p><button className="text-link" type="button" onClick={startCreate}>Add your first {isEvents ? "event" : "sermon"} →</button></div>}
    </section>
  );
}
