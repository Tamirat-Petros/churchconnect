import { useCallback, useEffect, useState } from "react";
import { ErrorMessage, Loading, SuccessMessage } from "../components/Feedback.jsx";
import { adminApi } from "../services/api.js";

const languageNames = { en: "English", am: "Amharic", om: "Afaan Oromo", ti: "Tigrinya" };
const statuses = ["pending", "contacted", "active", "declined"];

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setMembers(await adminApi.members(filter)); }
    catch (reason) { setError(reason.message); }
    finally { setLoading(false); }
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  async function setStatus(member, status) {
    setBusy(member._id); setError(""); setSuccess("");
    try {
      await adminApi.updateMember(member._id, status);
      setSuccess(`${member.fullName} marked ${status}.`);
      await load();
    } catch (reason) { setError(reason.message); }
    finally { setBusy(""); }
  }

  async function remove(member) {
    if (!window.confirm(`Permanently delete ${member.fullName}'s membership application and contact details?`)) return;
    setBusy(member._id); setError(""); setSuccess("");
    try {
      await adminApi.removeMember(member._id);
      setSuccess(`${member.fullName}'s application was deleted.`);
      await load();
    } catch (reason) { setError(reason.message); }
    finally { setBusy(""); }
  }

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading"><div><p className="eyebrow">WELCOME TEAM</p><h1>Membership interest</h1><p>Follow up with people who asked to connect. Contact details are private to administrators.</p></div>
        <label className="registration-filter"><span>Show applications</span><select value={filter} onChange={(event) => setFilter(event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}<option value="">All applications</option></select></label>
      </div>
      <ErrorMessage>{error}</ErrorMessage><SuccessMessage>{success}</SuccessMessage>
      {loading ? <Loading label="Loading membership applications..." /> : members.length ? <div className="member-list">{members.map((member) => <article className="member-card" key={member._id}>
        <div className="member-card-heading"><div><p className="eyebrow">Received {new Date(member.createdAt).toLocaleDateString()}</p><h2>{member.fullName}</h2></div><span className={`status-pill status-${member.status === "active" ? "active" : member.status === "pending" ? "pending" : "muted"}`}>{member.status}</span></div>
        <div className="member-details"><span><strong>Language</strong>{languageNames[member.preferredLanguage] || member.preferredLanguage}</span>{member.city && <span><strong>Area</strong>{member.city}</span>}{member.householdName && <span><strong>Household</strong>{member.householdName}</span>}
          {member.email && <span><strong>Email</strong><a href={`mailto:${member.email}`}>{member.email}</a></span>}{member.phone && <span><strong>Phone</strong><a href={`tel:${member.phone}`}>{member.phone}</a></span>}
        </div>
        {member.introduction && <p className="member-introduction">“{member.introduction}”</p>}
        <div className="member-actions">{member.status !== "contacted" && <button type="button" disabled={busy === member._id} onClick={() => setStatus(member, "contacted")}>Mark contacted</button>}{member.status !== "active" && <button type="button" disabled={busy === member._id} onClick={() => setStatus(member, "active")}>Welcome as member</button>}{member.status !== "declined" && <button className="danger-link" type="button" disabled={busy === member._id} onClick={() => setStatus(member, "declined")}>Close application</button>}<button className="danger-link" type="button" disabled={busy === member._id} onClick={() => remove(member)}>Delete details</button></div>
      </article>)}</div> : !error && <div className="empty-state admin-empty"><p>No {filter || "membership"} applications yet.</p></div>}
    </section>
  );
}
