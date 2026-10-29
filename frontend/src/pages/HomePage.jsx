import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnnouncementCard, EventCard, MinistryCard, SectionHeading, SermonCard } from "../components/ContentCards.jsx";
import { ErrorMessage, Loading } from "../components/Feedback.jsx";
import { publicApi } from "../services/api.js";
import { churchImages } from "../utils/church-images.js";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [sermons, setSermons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([publicApi.events(), publicApi.sermons(), publicApi.announcements(), publicApi.ministries()])
      .then(([eventData, sermonData, announcementData, ministryData]) => {
        const now = Date.now();
        setEvents(eventData.filter((event) => new Date(event.date).getTime() >= now).slice(0, 2));
        setSermons(sermonData.slice(0, 2));
        setAnnouncements(announcementData.slice(0, 2));
        setMinistries(ministryData.slice(0, 2));
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-media"><img src={churchImages.hero} alt="A congregation gathered for worship" fetchPriority="high" /></div>
        <div className="hero-shade" />
        <div className="hero-content page-width">
          <p className="hero-kicker">A community of faith in Addis Ababa</p>
          <h1>There’s a place<br />for you <em>here.</em></h1>
          <p className="hero-copy">Come as you are. Find good people, honest hope, and a faith that makes room for everyone.</p>
          <div className="hero-actions"><Link to="/about" className="button button-gold">Get to know us</Link><a href="#visit" className="button button-ghost">Plan your visit</a></div>
          <div className="hero-service"><span className="service-dot" /> SUNDAYS AT 10:00 AM EAT <span className="service-divider">·</span> ADDIS ABABA, ETHIOPIA</div>
        </div>
        <aside className="hero-aside" aria-label="Sunday worship details">
          <span className="hero-aside-mark" aria-hidden="true">g</span>
          <p className="hero-aside-label">A SUNDAY TOGETHER</p>
          <strong>There’s room<br />for <em>everyone.</em></strong>
          <span className="hero-aside-rule" />
          <p>Worship with us<br /><b>Sunday · 10:00 am EAT</b></p>
        </aside>
        <a className="hero-scroll" href="#welcome" aria-label="Scroll to learn more">↓</a>
      </section>

      <div className="welcome-ribbon" aria-label="Come as you are. Grow together. Make room for everyone.">
        <span>Come as you are</span><i aria-hidden="true">✳</i><span>Grow together</span><i aria-hidden="true">✳</i><span>Make room for everyone</span><i aria-hidden="true">✳</i><span>Come as you are</span>
      </div>

      <section className="welcome-section page-width" id="welcome">
        <div className="welcome-copy">
          <p className="eyebrow">A little about us</p>
          <h2>Faith is better<br /><em>when we share it.</em></h2>
          <p>We’re a neighborhood church learning to love God and one another in practical, everyday ways. There’s no dress code, no need to have it all figured out—just room to take your next step.</p>
          <Link className="text-link" to="/about">More about our community <span aria-hidden="true">→</span></Link>
        </div>
        <div className="welcome-note">
          <span className="note-icon" aria-hidden="true">✳</span>
          <blockquote>“We believe a small act of welcome can change the shape of someone’s whole week.”</blockquote>
          <span className="note-byline">THE HEART OF GRACE COMMUNITY</span>
        </div>
      </section>

      <section className="visit-band" id="visit">
        <div className="page-width visit-inner">
          <div><p className="eyebrow">Your Sunday, made simple</p><h2>Come exactly as you are.</h2><p>Gather with us for an hour of music, a thoughtful message, and a warm hello.</p></div>
          <div className="visit-facts"><p><strong>Sunday worship</strong><span>10:00 am EAT · All ages welcome</span></p><p><strong>Find us</strong><span>Addis Ababa, Ethiopia</span></p></div>
          <Link className="button button-outline" to="/contact">Get directions</Link>
        </div>
      </section>

      <section className="page-width content-section">
        <SectionHeading eyebrow="Make room in your week" action="See all events" to="/events">Good things are happening.</SectionHeading>
        {loading ? <Loading label="Finding upcoming events..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : events.length ? <div className="card-grid">{events.map((event) => <EventCard event={event} key={event._id} />)}</div> : <p className="empty-state">New community events are on the way. Check back soon.</p>}
      </section>

      <section className="sermon-section">
        <div className="page-width content-section">
          <SectionHeading eyebrow="News from the community" action="All updates" to="/announcements">A few things to know.</SectionHeading>
          {loading ? <Loading label="Loading announcements..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : announcements.length ? <div className="announcement-list">{announcements.map((announcement) => <AnnouncementCard announcement={announcement} key={announcement._id} />)}</div> : <p className="empty-state">There are no current announcements.</p>}
        </div>
      </section>

      <section>
        <div className="page-width content-section">
          <SectionHeading eyebrow="A moment to reflect" action="Explore all messages" to="/sermons">Words for the week ahead.</SectionHeading>
          {loading ? <Loading label="Loading recent messages..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : sermons.length ? <div className="card-grid">{sermons.map((sermon) => <SermonCard sermon={sermon} key={sermon._id} />)}</div> : <p className="empty-state">New messages will be shared here soon.</p>}
        </div>
      </section>
      <section className="page-width content-section">
        <SectionHeading eyebrow="Find a place to belong" action="Explore ministries" to="/ministries">There’s room for you.</SectionHeading>
        {loading ? <Loading label="Loading ministries..." /> : error ? <ErrorMessage>{error}</ErrorMessage> : ministries.length ? <div className="card-grid">{ministries.map((ministry) => <MinistryCard ministry={ministry} key={ministry._id} />)}</div> : <p className="empty-state">Ministry details will be shared here soon.</p>}
      </section>
      <section className="prayer-banner page-width"><span className="prayer-mark" aria-hidden="true">✳</span><div><p className="eyebrow">You don’t have to carry it alone</p><h2>We’d be honored to pray with you.</h2></div><Link to="/prayer" className="button button-outline">Share a prayer request</Link></section>
    </>
  );
}
