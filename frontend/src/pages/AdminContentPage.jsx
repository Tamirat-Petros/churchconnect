import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorMessage, FormField, Loading, SuccessMessage } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

const configurations = {
  events: {
    label: "Events",
    singular: "Event",
    description: "Keep the community in the loop about what’s coming up.",
    fields: [
      { name: "title", label: "Event title", required: true, maxLength: 120 },
      { name: "date", label: "Date and time (EAT)", type: "datetime-local", required: true },
      { name: "location", label: "Location", required: true, maxLength: 160 },
      { name: "imageUrl", label: "Image URL (optional)", type: "url", maxLength: 500 },
      { name: "description", label: "Description", type: "textarea", required: true, minLength: 10, maxLength: 2000 }
    ],
    newRecord: { title: "", description: "", date: "", location: "", imageUrl: "" }
  },
  sermons: {
    label: "Sermons",
    singular: "Sermon",
    description: "Share thoughtful messages with your community.",
    fields: [
      { name: "title", label: "Sermon title", required: true, maxLength: 120 },
      { name: "speaker", label: "Speaker", required: true, maxLength: 100 },
      { name: "date", label: "Date", type: "datetime-local", required: true },
      { name: "mediaUrl", label: "External video or audio URL (optional)", type: "url", maxLength: 500 },
      { name: "thumbnailUrl", label: "Thumbnail URL (optional)", type: "url", maxLength: 500 },
      { name: "description", label: "Description", type: "textarea", required: true, minLength: 10, maxLength: 2000 }
    ],
    newRecord: { title: "", speaker: "", date: "", description: "", mediaUrl: "", thumbnailUrl: "" }
  },
  announcements: {
    label: "Announcements",
    singular: "Announcement",
    description: "Share updates, reminders, and news with the community.",
    fields: [
      { name: "title", label: "Announcement title", required: true, maxLength: 120 },
      { name: "publishAt", label: "Publish date and time (leave blank to publish now)", type: "datetime-local" },
      { name: "expiresAt", label: "Expiry date and time (optional)", type: "datetime-local" },
      { name: "content", label: "Announcement", type: "textarea", required: true, minLength: 10, maxLength: 3000 },
      { name: "isPublished", label: "Visible to the public", type: "select", options: [["true", "Published"], ["false", "Draft"]] }
    ],
    newRecord: { title: "", content: "", publishAt: "", expiresAt: "", isPublished: true }
  },
  ministries: {
    label: "Ministries",
    singular: "Ministry",
    description: "Manage ministry groups and the details visitors can see.",
    fields: [
      { name: "name", label: "Ministry name", required: true, minLength: 2, maxLength: 120 },
      { name: "meetingTime", label: "Meeting time (optional)", maxLength: 160 },
      { name: "contactEmail", label: "Public contact email (optional)", type: "email", maxLength: 254 },
      { name: "imageUrl", label: "Image URL (optional)", type: "url", maxLength: 500 },
      { name: "description", label: "Description", type: "textarea", required: true, minLength: 10, maxLength: 2000 },
      { name: "isActive", label: "Visible in public directory", type: "select", options: [["true", "Active"], ["false", "Hidden"]] }
    ],
    newRecord: { name: "", description: "", meetingTime: "", contactEmail: "", imageUrl: "", isActive: true }
  }
};

function inputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function recordTitle(record, collection) {
  return collection === "ministries" ? record.name : record.title;
}

function recordDescription(record, collection) {
  return record.description || record.content || "";
}

export default function AdminContentPage() {
  const { collection } = useParams();
  const config = configurations[collection];
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(config?.newRecord ?? {});
  const [editing, setEditing] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRecords = useCallback(async () => {
    if (!config) { setLoading(false); setError("This content section was not found."); return; }
    setError("");
    setLoading(true);
    try { setRecords(await adminApi.records(collection)); }
    catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }, [collection, config]);

  useEffect(() => {
    setForm(config?.newRecord ?? {});
    setEditing("");
    setShowForm(false);
    loadRecords();
  }, [collection, loadRecords]);

  function startEdit(record) {
    const next = { ...config.newRecord, ...record };
    for (const field of config.fields) {
      if (field.type === "datetime-local") next[field.name] = inputDate(record[field.name]);
      if (field.type === "select") next[field.name] = String(record[field.name] ?? true);
    }
    setEditing(record._id);
    setForm(next);
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startCreate() {
    setEditing("");
    setForm(config.newRecord);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditing("");
    setForm(config.newRecord);
    setShowForm(false);
    setError("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const data = { ...form };
    for (const field of config.fields) {
      if (field.type === "datetime-local") {
        if (form[field.name]) data[field.name] = new Date(form[field.name]).toISOString();
        else if (collection === "announcements" && field.name === "publishAt") {
          if (editing) data[field.name] = new Date().toISOString();
          else delete data[field.name];
        }
        else data[field.name] = "";
      }
      if (field.type === "select") data[field.name] = form[field.name] === "true" || form[field.name] === true;
    }
    try {
      if (editing) await adminApi.update(collection, editing, data);
      else await adminApi.create(collection, data);
      setSuccess(`${config.singular} ${editing ? "updated" : "created"}.`);
      cancelEdit();
      await loadRecords();
    } catch (reason) { setError(reason.message); }
    finally { setSaving(false); }
  }

  async function remove(record) {
    const title = recordTitle(record, collection);
    const extra = collection === "events" ? " Registrations for this event will also be deleted." : "";
    if (!window.confirm(`Delete “${title}”? This cannot be undone.${extra}`)) return;
    setError("");
    setSuccess("");
    try {
      await adminApi.remove(collection, record._id);
      setSuccess(`${config.singular} deleted.`);
      await loadRecords();
    } catch (reason) { setError(reason.message); }
  }

  if (!config) return <section className="admin-list-page"><ErrorMessage>This content section was not found.</ErrorMessage></section>;

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading"><div><p className="eyebrow">CONTENT MANAGEMENT</p><h1>{config.label}</h1><p>{config.description}</p></div><button className="button button-dark" type="button" onClick={startCreate}>＋ Add {config.singular.toLowerCase()}</button></div>
      <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
      {showForm && <form className="admin-form-card" onSubmit={save}>
        <div className="admin-form-heading"><div><p className="eyebrow">{editing ? "UPDATE CONTENT" : "NEW CONTENT"}</p><h2>{editing ? `Update ${config.singular.toLowerCase()}` : `Add ${config.singular.toLowerCase()}`}</h2></div><button className="icon-button" type="button" onClick={cancelEdit} aria-label="Close form">×</button></div>
        <div className="admin-form-grid">{config.fields.map((field) => field.type === "select"
          ? <FormField key={field.name} label={field.label} name={field.name} as="select" value={String(form[field.name])} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</FormField>
          : <FormField key={field.name} label={field.label} name={field.name} as={field.type === "textarea" ? "textarea" : "input"} type={field.type === "textarea" ? undefined : field.type || "text"} required={field.required} minLength={field.minLength} maxLength={field.maxLength} rows={field.type === "textarea" ? 4 : undefined} value={form[field.name] ?? ""} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />)}</div>
        <div className="form-actions"><button className="button button-dark" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : `Create ${config.singular.toLowerCase()}`}</button><button className="button button-muted" type="button" onClick={cancelEdit}>Cancel</button></div>
      </form>}
      {loading ? <Loading label={`Loading ${config.label.toLowerCase()}...`} /> : records.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{collection === "ministries" ? "Ministry" : "Title"}</th><th>{collection === "events" ? "Date & location" : collection === "sermons" ? "Speaker" : collection === "announcements" ? "Publish status" : "Meeting time"}</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{records.map((record) => <tr key={record._id}>
        <td><strong>{recordTitle(record, collection)}</strong><span className="table-description">{recordDescription(record, collection)}</span></td>
        <td>{collection === "events" ? <>{new Date(record.date).toLocaleString()}<span className="table-description">{record.location}</span></> : collection === "sermons" ? record.speaker : collection === "announcements" ? <><span className={`status-pill ${record.isPublished ? "status-active" : "status-muted"}`}>{record.isPublished ? "Published" : "Draft"}</span><span className="table-description">{new Date(record.publishAt).toLocaleString()}</span></> : <><span className={`status-pill ${record.isActive ? "status-active" : "status-muted"}`}>{record.isActive ? "Active" : "Hidden"}</span>{record.meetingTime && <span className="table-description">{record.meetingTime}</span>}</>}</td>
        <td>{new Date(record.updatedAt).toLocaleDateString()}</td><td className="row-actions"><button type="button" onClick={() => startEdit(record)}>Edit</button><button className="danger-link" type="button" onClick={() => remove(record)}>Delete</button></td>
      </tr>)}</tbody></table></div> : !error && <div className="empty-state admin-empty"><p>No {config.label.toLowerCase()} yet.</p><button className="text-link" type="button" onClick={startCreate}>Add the first {config.singular.toLowerCase()} →</button></div>}
    </section>
  );
}
