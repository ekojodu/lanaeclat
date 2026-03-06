import { useLocation, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './BookingConfirmation.css';

interface BookingState {
  name: string;
  service: string;
  date: string;
  time: string;
}

export default function BookingConfirmation() {
  const location = useLocation();
  const revealRef = useScrollReveal();
  const booking = location.state as BookingState | null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <main className="confirm-page" ref={revealRef as any}>
      <div className="confirm-container reveal">

        {/* Icon */}
        <div className="confirm-icon-wrap">
          <div className="confirm-icon">✦</div>
          <div className="confirm-rings">
            <span /><span /><span />
          </div>
        </div>

        {/* Heading */}
        <h1 className="confirm-title reveal reveal-delay-1">
          Booking Request <em>Received</em>
        </h1>
        <p className="confirm-subtitle reveal reveal-delay-1">
          Thank you{booking?.name ? `, ${booking.name.split(' ')[0]}` : ''}! Your appointment request has been sent to Lana Éclat.
        </p>

        {/* Booking Summary */}
        {booking && (
          <div className="confirm-card reveal reveal-delay-2">
            <div className="confirm-card-title">Your Booking Summary</div>
            <div className="confirm-details">
              {booking.service && (
                <div className="confirm-row">
                  <span className="confirm-label">Treatment</span>
                  <span className="confirm-value">{booking.service}</span>
                </div>
              )}
              {booking.date && (
                <div className="confirm-row">
                  <span className="confirm-label">Preferred Date</span>
                  <span className="confirm-value">{formatDate(booking.date)}</span>
                </div>
              )}
              {booking.time && (
                <div className="confirm-row">
                  <span className="confirm-label">Preferred Time</span>
                  <span className="confirm-value">{booking.time}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="confirm-steps reveal reveal-delay-3">
          <div className="confirm-steps-title">What happens next?</div>
          <div className="confirm-step">
            <div className="confirm-step-num">1</div>
            <div>
              <strong>We review your request</strong>
              <p>Our team will review your preferred date and time within a few hours.</p>
            </div>
          </div>
          <div className="confirm-step">
            <div className="confirm-step-num">2</div>
            <div>
              <strong>You get a confirmation</strong>
              <p>We'll reach out via WhatsApp or email to confirm your appointment slot.</p>
            </div>
          </div>
          <div className="confirm-step">
            <div className="confirm-step-num">3</div>
            <div>
              <strong>Your glow awaits</strong>
              <p>Show up, relax and let us take care of your skin.</p>
            </div>
          </div>
        </div>

        {/* WhatsApp nudge */}
        <div className="confirm-whatsapp reveal reveal-delay-3">
          <p>Need to confirm faster? Reach us directly on WhatsApp:</p>
          <a
            href="https://wa.me/2348104461674?text=Hello%20Lana%20Éclat%2C%20I%20just%20submitted%20a%20booking%20request%20and%20wanted%20to%20follow%20up."
            target="_blank"
            rel="noreferrer"
            className="whatsapp-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.294 22l4.979-1.125A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.953 7.953 0 01-4.184-1.186l-.3-.178-3.115.703.74-2.987-.196-.307A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Actions */}
        <div className="confirm-actions reveal reveal-delay-3">
          <Link to="/" className="btn-primary"><span>Back to Home</span></Link>
          <Link to="/services" className="btn-outline">Explore Treatments</Link>
        </div>
      </div>
    </main>
  );
}
