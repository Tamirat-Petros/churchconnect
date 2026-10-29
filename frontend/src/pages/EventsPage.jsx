import { useEffect, useState } from "react";
import { EventCard } from "../components/ContentCards.jsx";
import EventRegistrationForm from "../components/EventRegistrationForm.jsx";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [calendar, setCalendar] = useState(() => window.localStorage.getItem("churchconnect-calendar") || "ethiopic");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    publicApi.events().then(setEvents).catch((reason) => setError(reason.message)).finally(() => setLoading(false));
  }, []);
  const now = Date.now();
  const upcoming = events.filter((event) => new Date(event.date).getTime() >= now);
  const past = events.filter((event) => new Date(event.date).getTime() < now).sort((a, b) => new Date(b.date) - new Date(a.date));
  function chooseCalendar(value) {
    setCalendar(value);
    window.localStorage.setItem("churchconnect-calendar", value);
  }
  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">Gather with us</p><h1>Good things<br /><em>happen together.</em></h1><p>Find a little time to connect, serve, learn, and share life. Event times are shown in Addis Ababa time (EAT).</p></section>
      <section className="page-width listing-section">
        {loading ? <Loading label="Loading events..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : <>
          <div className="events-toolbar"><div className="section-heading"><div><p className="eyebrow">Coming up</p><h2>On the calendar</h2></div></div><div className="calendar-switch" role="group" aria-label="Calendar format"><span>Calendar</span><button type="button" aria-pressed={calendar === "ethiopic"} onClick={() => chooseCalendar("ethiopic")}>Ethiopian <span lang="am">ኢትዮጵያዊ</span></button><button type="button" aria-pressed={calendar === "gregory"} onClick={() => chooseCalendar("gregory")}>Gregorian</button></div></div>
          {upcoming.length ? <div className="card-grid event-listing-grid">{upcoming.map((event) => <div className="event-listing-item" key={event._id}><EventCard event={event} calendar={calendar} /><EventRegistrationForm eventId={event._id} /></div>)}</div> : <p className="empty-state">There are no upcoming events right now. We’ll share new dates soon.</p>}
          {past.length > 0 && <><div className="section-heading past-heading"><div><p className="eyebrow">The good moments</p><h2>Past gatherings</h2></div></div><div className="card-grid past-events">{past.map((event) => <EventCard key={event._id} event={event} calendar={calendar} />)}</div></>}
        </>}
      </section>
    </>
  );
}
