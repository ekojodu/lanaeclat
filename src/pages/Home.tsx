import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { treatments } from '../data/treatments';
import { ENV } from '../config/env';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Home.css';

function FloatingPetals() {
  return (
    <div className="petals-bg">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
            width: `${8 + Math.random() * 10}px`,
            height: `${8 + Math.random() * 10}px`,
            opacity: 0.2 + Math.random() * 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const revealRef = useScrollReveal();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      el.style.transform = `translateY(${y * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappNum = ENV.whatsapp.replace(/\D/g, '');

  return (
    <main className="home-page">
      {/* ===== HERO ===== */}
      <section className="hero">
        <FloatingPetals />

        <div className="hero-bg" ref={heroRef}>
          <div className="hero-gradient" />
        </div>

        <div className="hero-content container">
          <div className="hero-badge reveal">
            <span className="badge-dot" />
            <span>Kabba, Kogi State</span>
          </div>

          <h1 className="hero-title">
            <span className="reveal reveal-delay-1 hero-line">Your Skin,</span>
            <span className="reveal reveal-delay-2 hero-line italic">Our Passion.</span>
          </h1>

          <div className="deco-line reveal reveal-delay-2">
            <div className="deco-diamond" />
          </div>

          <p className="hero-subtitle reveal reveal-delay-3">
            "{ENV.tagline}"
          </p>

          <div className="hero-ctas reveal reveal-delay-4">
            <Link to="/contact" className="btn-primary">
              <span>✦ Book Appointment</span>
            </Link>
            <Link to="/services" className="btn-outline">
              <span>Our Services</span>
            </Link>
          </div>

          <div className="hero-stats reveal reveal-delay-4">
            <div className="stat">
              <span className="stat-num">7+</span>
              <span className="stat-label">Facial Treatments</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Quality Products</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">✦</span>
              <span className="stat-label">Real Results</span>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="marquee-strip">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="marquee-track">
            {['Professional Skincare', '✦', 'Visible Results', '✦', 'Gentle Touch', '✦', 'Real Glow', '✦', 'Kabba, Kogi', '✦'].map((t, j) => (
              <span key={j}>{t}</span>
            ))}
          </div>
        ))}
      </div>

      {/* ===== INTRO ===== */}
      <section className="section-pad intro-section" ref={revealRef as any}>
        <div className="container">
          <div className="intro-grid">
            <div className="intro-text">
              <p className="section-label reveal">About The Studio</p>
              <h2 className="reveal reveal-delay-1">
                Where skin finds<br />
                <em>its radiance</em>
              </h2>
              <div className="deco-line reveal reveal-delay-1">
                <div className="deco-diamond" />
              </div>
              <p className="reveal reveal-delay-2">
                At Lana Éclat, we believe every skin tells a story — and we're here to help yours shine.
                Based in the heart of Kabba, Kogi State, our studio brings professional-grade skincare
                with a personal touch that feels like home.
              </p>
              <p className="reveal reveal-delay-3" style={{ marginTop: '16px' }}>
                From deep cleansing to anti-aging treatments, every session is crafted around
                <strong> your unique skin</strong> — with sterilized tools, quality products, and zero shortcuts.
              </p>
              <div className="intro-badges reveal reveal-delay-4">
                {['Clean & Sterilized Tools', 'Quality Skincare Products', 'No Shortcuts Taken'].map(b => (
                  <span key={b} className="intro-badge">✓ {b}</span>
                ))}
              </div>
              <Link to="/about" className="btn-outline reveal reveal-delay-4" style={{ marginTop: '32px', display: 'inline-flex' }}>
                <span>Learn More About Us</span>
              </Link>
            </div>

            <div className="intro-visual reveal reveal-delay-2">
              <div className="intro-card">
                <div className="card-inner">
                  <div className="card-pattern" />
                  <div className="card-content">
                    <div className="card-icon">🌸</div>
                    <h3>Real skin.<br />Real results.<br /><em>Real glow.</em></h3>
                    <p>Your glow journey starts here.</p>
                  </div>
                </div>
                <div className="card-accent top-right" />
                <div className="card-accent bottom-left" />
              </div>
              <div className="floating-badge">
                <span className="badge-star">✦</span>
                <span>First-time client offer</span>
                <span className="badge-sub">Book today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="section-pad services-preview">
        <FloatingPetals />
        <div className="container">
          <div className="section-header reveal">
            <p className="section-label">What We Offer</p>
            <h2>Our Facial Treatments</h2>
            <div className="deco-line">
              <div className="deco-diamond" />
            </div>
          </div>

          <div className="treatments-grid">
            {treatments.map((t, i) => (
              <div
                key={t.id}
                className="treatment-card"
                style={{ '--delay': `${i * 0.07}s` } as any}
              >
                {t.highlight && <span className="treatment-highlight">{t.highlight}</span>}
                <div className="treatment-emoji">{t.emoji}</div>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <div className="treatment-footer">
                  <span className="treatment-duration">⏱ {t.duration}</span>
                  <Link to="/contact" className="treatment-book">Book →</Link>
                </div>
              </div>
            ))}
          </div>

          <div className="services-cta reveal" style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/services" className="btn-primary">
              <span>View All Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="section-pad why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-text reveal">
              <p className="section-label">Why Lana Éclat</p>
              <h2>We treat skin with care,<br /><em>not shortcuts</em></h2>
              <div className="deco-line">
                <div className="deco-diamond" />
              </div>
              <div className="why-reasons">
                {[
                  { icon: '🧴', title: 'Quality Products', desc: 'Only premium, skin-safe formulations used in every treatment.' },
                  { icon: '🧪', title: 'Sterilized Tools', desc: 'Every tool is cleaned and sterilized before each session.' },
                  { icon: '👐', title: 'Personalized Care', desc: 'Tailored approach for your unique skin type and concerns.' },
                  { icon: '✨', title: 'Visible Results', desc: 'See the difference from your very first session.' },
                ].map((r, i) => (
                  <div key={r.title} className={`why-reason reveal reveal-delay-${i + 1}`}>
                    <span className="why-icon">{r.icon}</span>
                    <div>
                      <strong>{r.title}</strong>
                      <p>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="why-visual reveal reveal-delay-2">
              <div className="why-card">
                <div className="why-card-inner">
                  <div className="offer-label">Special Offer</div>
                  <div className="offer-title">First-Time<br />Clients</div>
                  <div className="offer-star">✦</div>
                  <p className="offer-desc">Get a special discount on your first facial treatment at Lana Éclat.</p>
                  <p className="offer-note">Limited slots available — book early!</p>
                  <Link to="/contact" className="btn-primary" style={{ marginTop: '24px', justifyContent: 'center' }}>
                    <span>Claim Your Offer</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="cta-banner">
        <div className="cta-banner-inner container">
          <div className="reveal">
            <p className="section-label" style={{ color: 'var(--rose-blush)' }}>Start Today</p>
            <h2 style={{ color: 'white' }}>Your glow journey <em>starts here</em></h2>
          </div>
          <div className="cta-actions reveal">
            <Link to="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--rose-deep)' }}>
              <span>Book Appointment</span>
            </Link>
            {whatsappNum && (
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noreferrer" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                <span>WhatsApp Us</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
