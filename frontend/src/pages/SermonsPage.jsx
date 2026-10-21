import { useEffect, useState } from "react";
import { SermonCard } from "../components/ContentCards.jsx";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function SermonsPage() {
  const [search, setSearch] = useState("");
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true); setError("");
      publicApi.sermons(search)
        .then((data) => { if (!cancelled) setSermons(data); })
        .catch((reason) => { if (!cancelled) setError(reason.message); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [search]);
  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">Listen in, wherever you are</p><h1>A little truth<br /><em>for the road.</em></h1><p>Recent messages and reflections from our community.</p></section>
      <section className="page-width listing-section">
        <label className="search-field" htmlFor="sermon-search"><span>Search by title or speaker</span><input id="sermon-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try “welcome” or a speaker’s name" /></label>
        {loading ? <Loading label="Finding messages..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : sermons.length ? <div className="card-grid">{sermons.map((sermon) => <SermonCard key={sermon._id} sermon={sermon} />)}</div> : <p className="empty-state">No messages match that search. Try another title or speaker.</p>}
      </section>
    </>
  );
}
