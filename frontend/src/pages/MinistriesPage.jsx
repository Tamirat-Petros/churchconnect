import { useEffect, useState } from "react";
import { MinistryCard } from "../components/ContentCards.jsx";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    publicApi.ministries()
      .then(setMinistries)
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">Find your people</p><h1>There’s room<br /><em>to belong.</em></h1><p>Explore the teams and gatherings that help our community care, learn, and grow together.</p></section>
      <section className="page-width listing-section">
        {loading ? <Loading label="Loading ministries..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : ministries.length ? <div className="card-grid">{ministries.map((ministry) => <MinistryCard ministry={ministry} key={ministry._id} />)}</div> : <p className="empty-state">Ministry details will be shared here soon.</p>}
      </section>
    </>
  );
}
