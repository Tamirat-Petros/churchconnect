import { Link } from "react-router-dom";

const values = [
  ["01", "A generous welcome", "Every person carries a story worth hearing. We make space for people to arrive as they are."],
  ["02", "Faith in practice", "We believe compassion is something we do—in our homes, our neighborhood, and with one another."],
  ["03", "Growing together", "Questions are welcome here. We learn, serve, and discover what matters side by side."]
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-width"><p className="eyebrow">Our story</p><h1>A church with<br /><em>room to grow.</em></h1><p>Rooted in Riverdale, open to everyone. We’re glad you found us.</p></section>
      <section className="story-section page-width">
        <div><p className="eyebrow">A little history</p><h2>Neighbors first.<br />Church, together.</h2></div>
        <div className="story-copy"><p>Grace Community began in 1987, when a handful of Riverdale families started gathering around a shared table. They hoped to build a church that felt less like a building you visited and more like a community you belonged to.</p><p>Today, we’re still learning what that looks like. We worship, share meals, tend a neighborhood garden, and make time for people who need a listening ear. Our life together is a work in progress—and there’s room for you in it.</p><p className="signature">With grace, <span>The Grace Community family</span></p></div>
      </section>
      <section className="mission-vision-section">
        <div className="page-width mission-vision-grid">
          <article><p className="eyebrow">Our mission</p><h2>Practice a generous faith in everyday life.</h2><p>We gather, learn, and serve so that people can experience belonging and care—in the church and throughout our neighborhood.</p></article>
          <article><p className="eyebrow">Our vision</p><h2>A neighborhood where everyone has room to flourish.</h2><p>We hope for a connected community where compassion is shared, questions are welcomed, and no one has to walk alone.</p></article>
        </div>
      </section>
      <section className="values-section"><div className="page-width"><p className="eyebrow">What guides us</p><h2>Our values, in real life.</h2><div className="values-grid">{values.map(([number, title, text]) => <article className="value-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="ministry-section page-width"><div><p className="eyebrow">Life beyond Sunday</p><h2>There are a lot of ways<br />to find your people.</h2></div><div><p>Our Community Garden brings neighbors together to grow food and friendship. The Shared Table makes room for a meal and conversation. Our Care Team offers a listening ear and prayer when life feels heavy.</p><p>You don’t need to sign up for anything to belong—just come and see.</p><Link className="text-link" to="/events">Find something coming up <span aria-hidden="true">→</span></Link></div></section>
    </>
  );
}
