import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ENV } from '../config/env';
import './Navbar.css';

const navLinks = [
  { path: '/',          label: 'Home' },
  { path: '/about',     label: 'About' },
  { path: '/services',  label: 'Services' },
  { path: '/gallery',   label: 'Gallery' },
  { path: '/contact',   label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-script">{ENV.businessName.split(' ').slice(0, 2).join(' ')}</span>
          <span className="brand-sub">Beauty Studio</span>
        </Link>

        <ul className="nav-links">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={location.pathname === path ? 'active' : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="btn-primary nav-cta">
          <span>Book Now</span>
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu - only render contents when open */}
      {menuOpen && (
        <div className="mobile-menu open">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={location.pathname === path ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary mobile-cta" onClick={() => setMenuOpen(false)}>
            <span>Book Appointment</span>
          </Link>
        </div>
      )}
    </nav>
  );
}