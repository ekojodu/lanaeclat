import { useScrollReveal } from '../hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { ENV } from '../config/env';
import './About.css';

const values = [
  { icon: '🌿', title: 'Natural Approach', desc: 'We work with your skin\'s natural processes, not against them.' },
  { icon: '🔬', title: 'Scientific Care', desc: 'Evidence-based skincare techniques rooted in dermatological science.' },
  { icon: '💛', title: 'Personal Touch', desc: 'You\'re not a client — you\'re a guest, treated with warmth every time.' },
  { icon: '✨', title: 'Real Results', desc: 'We measure success by the glow on your face when you leave.' },
];

const team = [
  {
    name: 'Lana',
    title: 'Founder & Lead Esthetician',
    bio: 'With years of professional skincare training and a passion for helping women radiate confidence, Lana founded the studio to bring world-class facials to Kabba, Kogi State.',
    emoji: '🌸',
  },
];

export default function About() {
  const revealRef = useScrollReveal();

  return (
    <main className="about-page" ref={revealRef as any}>
      {/* Page Header */}
      <section className="page-header">
        <div className="page-header-bg" />
        <div className="container page-header-content">
          <p className="section-label reveal">Our Story</p>
          <h1 className="reveal reveal-delay-1">About <em>Lana Éclat</em></h1>
          <div className="deco-line reveal reveal-delay-2">
            <div className="deco-diamond-sm" />
          </div>
          <p className="page-subtitle reveal reveal-delay-2">
            Born in Kabba, built for every skin type, rooted in care.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad">
        <div className="container about-story">
          <div className="story-visual reveal">
            <div className="story-card">
              <div className="story-card-bg" />
              <div className="story-card-text">
                <span className="story-year">Est. Kabba</span>
                <h3>Where it all began</h3>
                <p>A passion for skin. A dream for Kabba.</p>
              </div>
            </div>
          </div>
          <div className="story-content">
            <p className="section-label reveal">The Beginning</p>
            <h2 className="reveal reveal-delay-1">A studio built on<br /><em>real skin, real love</em></h2>
            <div className="deco-line reveal reveal-delay-1"><div className="deco-diamond-sm" /></div>
            <p className="reveal reveal-delay-2">
              Lana Éclat Beauty Studio was born from a simple but powerful belief: every person
              deserves professional skincare — no matter where they live. In the heart of Kabba,
              Kogi State, we opened our doors to bring visible, lasting results to every skin type.
            </p>
            <p className="reveal reveal-delay-3">
              We didn't want to offer just another beauty service. We wanted a sanctuary — a place
              where you could exhale, be seen, and walk out glowing with renewed confidence. A place
              where your skin is treated as the unique canvas it truly is.
            </p>
            <p className="reveal reveal-delay-4">
              Today, {ENV.businessName} stands as Kabba's dedicated facial studio — a space where
              science meets warmth, and every treatment is a step toward your most luminous self.
            </p>
            <Link to="/contact" className="btn-primary reveal reveal-delay-4" style={{ marginTop: '28px', display: 'inline-flex' }}>
              <span>Book Your First Visit</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad values-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Our Foundation</p>
            <h2>What drives us every day</h2>
            <div className="deco-line"><div className="deco-diamond-sm" /></div>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={v.title} className={`value-card reveal reveal-delay-${i + 1}`}>
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad team-section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">Meet The Team</p>
            <h2>The hands behind your glow</h2>
            <div className="deco-line"><div className="deco-diamond-sm" /></div>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.name} className="team-card reveal">
                <div className="team-avatar">
                  <span>{member.emoji}</span>
                </div>
                <h3>{member.name}</h3>
                <span className="team-title">{member.title}</span>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section">
        <div className="mission-inner container reveal">
          <p className="section-label" style={{ color: 'var(--rose-blush)' }}>Our Mission</p>
          <blockquote>
            "To make every person who walks through our doors feel seen, cared for, and beautiful
            — because glowing skin is not a luxury, it's a lifestyle."
          </blockquote>
          <p className="mission-attr">— {ENV.businessName}</p>
        </div>
      </section>
    </main>
  );
}
