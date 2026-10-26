import { useState } from "react";
import { Link } from "react-router-dom";

export function EventCard({ event }) {
  const [imageFailed, setImageFailed] = useState(false);
  const date = new Date(event.date);
  return (
    <article className="content-card">
      {event.imageUrl && !imageFailed
        ? <img className="card-image" src={event.imageUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        : event.imageUrl && <div className="card-image-fallback" aria-hidden="true"><span>GRACE COMMUNITY</span><i>✳</i></div>}
      <div className="card-content">
        <p className="eyebrow">{date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <span className="card-meta">{date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · {event.location}</span>
      </div>
    </article>
  );
}

export function SermonCard({ sermon }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="content-card sermon-card">
      {sermon.thumbnailUrl && !imageFailed
        ? <img className="card-image" src={sermon.thumbnailUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        : <div className="sermon-art" aria-hidden="true"><span>GRACE</span><i>“</i></div>}
      <div className="card-content">
        <p className="eyebrow">{new Date(sermon.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
        <h3>{sermon.title}</h3>
        <p>{sermon.description}</p>
        <span className="card-meta">A message from {sermon.speaker}</span>
        {sermon.mediaUrl && <a className="text-link" href={sermon.mediaUrl} target="_blank" rel="noreferrer">Listen or watch <span aria-hidden="true">↗</span></a>}
      </div>
    </article>
  );
}

export function AnnouncementCard({ announcement }) {
  return (
    <article className="announcement-card">
      <p className="eyebrow">{new Date(announcement.publishAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
      <h2>{announcement.title}</h2>
      <p>{announcement.content}</p>
    </article>
  );
}

export function MinistryCard({ ministry }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="content-card ministry-card">
      {ministry.imageUrl && !imageFailed
        ? <img className="card-image ministry-image" src={ministry.imageUrl} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        : <div className="ministry-art" aria-hidden="true"><span>GRACE COMMUNITY</span><i>✳</i></div>}
      <div className="card-content"><p className="eyebrow">Ministry</p><h2>{ministry.name}</h2><p>{ministry.description}</p>
        {ministry.meetingTime && <span className="card-meta">Meets {ministry.meetingTime}</span>}
        {ministry.contactEmail && <a className="text-link" href={`mailto:${ministry.contactEmail}`}>Get in touch <span aria-hidden="true">↗</span></a>}
      </div>
    </article>
  );
}

export function SectionHeading({ eyebrow, children, action, to }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2>{children}</h2></div>
      {action && <Link className="text-link" to={to}>{action} <span aria-hidden="true">→</span></Link>}
    </div>
  );
}
