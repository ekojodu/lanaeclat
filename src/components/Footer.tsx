import { Link } from 'react-router-dom';
import { ENV } from '../config/env';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  const whatsappNum = ENV.whatsapp.replace(/\D/g, '');

  return (
    <footer className="footer">
      {/* Petal deco */}
      <div className="footer-deco">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="footer-petal" style={{
            left: `${10 + i * 16}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${5 + i}s`,
          }} />
        ))}
      </div>

      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="brand-script">Lana Éclat</span>
            <span className="brand-sub">Beauty Studio</span>
          </div>
          <p className="footer-tagline">"{ENV.tagline}"</p>
          <div className="footer-socials">
            {ENV.instagram && (
              <a href={`https://instagram.com/${ENV.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
            )}
            {whatsappNum && (
              <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.294 22l4.979-1.125A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.953 7.953 0 01-4.184-1.186l-.3-.178-3.115.703.74-2.987-.196-.307A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>
              </a>
            )}
            {ENV.facebookUrl && (
              <a href={ENV.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            )}
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Navigate</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Deep Cleansing</Link></li>
            <li><Link to="/services">Hydrating Facial</Link></li>
            <li><Link to="/services">Glow Facial</Link></li>
            <li><Link to="/services">Acne Treatment</Link></li>
            <li><Link to="/services">Anti-Aging</Link></li>
          </ul>
        </div>

        <div className="footer-contact-info">
          <h4>Find Us</h4>
          <p>{ENV.location}</p>
          <a href={`tel:${ENV.phone}`}>{ENV.phone}</a>
          <a href={`mailto:${ENV.email}`}>{ENV.email}</a>
          <div className="footer-hours">
            <strong>Hours</strong>
            <span>Mon – Sat: 9am – 7pm</span>
            <span>Sunday: By appointment</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {year} Lana Éclat Beauty Studio. All rights reserved.</p>
        <p>..glowing skin is a lifestyle.</p>
      </div>
    </footer>
  );
}
