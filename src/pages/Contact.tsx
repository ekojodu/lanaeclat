import { useState, FormEvent } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ENV } from '../config/env';
import { treatments } from '../data/treatments';
import './Contact.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function Contact() {
  const revealRef = useScrollReveal();
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', service: '', date: '', time: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Build mailto body
    const body = `
Hello Lana Éclat Beauty Studio,

I would like to book an appointment:

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Service: ${form.service}
Preferred Date: ${form.date}
Preferred Time: ${form.time}

Additional Notes:
${form.message}

Looking forward to hearing from you!
    `.trim();

    const subject = encodeURIComponent(`${ENV.reservationSubject} — ${form.name}`);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${ENV.reservationEmail}?subject=${subject}&body=${encodedBody}`;

    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const mapEmbedUrl = ENV.googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${ENV.googleMapsApiKey}&q=${ENV.mapLat},${ENV.mapLng}&zoom=${ENV.mapZoom}`
    : `https://maps.google.com/maps?q=${ENV.mapLat},${ENV.mapLng}&z=${ENV.mapZoom}&output=embed`;

  const whatsappNum = ENV.whatsapp.replace(/\D/g, '');

  return (
    <main className="contact-page" ref={revealRef as any}>
      {/* Header */}
      <section className="page-header">
        <div className="page-header-bg" />
        <div className="container page-header-content">
          <p className="section-label reveal">Get In Touch</p>
          <h1 className="reveal reveal-delay-1">Book Your <em>Glow</em></h1>
          <div className="deco-line reveal reveal-delay-2"><div className="deco-diamond-sm" /></div>
          <p className="page-subtitle reveal reveal-delay-2">
            Secure your spot. Your skin has been waiting.
          </p>
        </div>
      </section>

      {/* Info Strip */}
      <div className="info-strip">
        {[
          { icon: '📍', label: 'Location', value: ENV.location },
          { icon: '📞', label: 'Call Us', value: ENV.phone, href: `tel:${ENV.phone}` },
          { icon: '✉️', label: 'Email', value: ENV.email, href: `mailto:${ENV.email}` },
          { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 9am–7pm' },
        ].map(item => (
          <div key={item.label} className="info-item">
            <span className="info-icon">{item.icon}</span>
            <div>
              <span className="info-label">{item.label}</span>
              {item.href
                ? <a href={item.href} className="info-value link">{item.value}</a>
                : <span className="info-value">{item.value}</span>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Form + Sidebar */}
      <section className="section-pad contact-section">
        <div className="container contact-grid">
          {/* Reservation Form */}
          <div className="form-wrapper reveal">
            <div className="form-header">
              <p className="section-label">Reservation</p>
              <h2>Book an Appointment</h2>
              <p className="form-subtitle">
                Fill in your details below and your preferred session info. We'll open your
                email client with everything pre-filled so you can confirm instantly.
              </p>
            </div>

            {submitted ? (
              <div className="success-msg">
                <div className="success-icon">✦</div>
                <h3>Opening your email...</h3>
                <p>Your reservation details have been prepared. Complete the email to confirm your booking with us.</p>
                <button className="btn-outline" onClick={() => setSubmitted(false)} style={{ marginTop: '24px' }}>
                  Book Another
                </button>
              </div>
            ) : (
              <form className="reservation-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input id="name" type="text" required placeholder="Your full name" value={form.name} onChange={set('name')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" type="email" required placeholder="you@email.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" type="tel" placeholder="+234 ..." value={form.phone} onChange={set('phone')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="service">Treatment *</label>
                    <select id="service" required value={form.service} onChange={set('service')}>
                      <option value="">Select a treatment</option>
                      {treatments.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date *</label>
                    <input
                      id="date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={form.date}
                      onChange={set('date')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Preferred Time *</label>
                    <select id="time" required value={form.time} onChange={set('time')}>
                      <option value="">Select a time</option>
                      {timeSlots.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Additional Notes</label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Any skin concerns, allergies, or requests we should know about..."
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>

                <button type="submit" className="btn-primary submit-btn">
                  <span>✦ Send Reservation Request</span>
                </button>

                <p className="form-note">
                  This will open your email app with the details filled in. We'll confirm your booking within 24 hours.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="contact-sidebar">
            <div className="sidebar-card reveal reveal-delay-1">
              <h3>Why book with us?</h3>
              {[
                '✓ First-time client special offer',
                '✓ Sterilized tools, every session',
                '✓ Premium skincare products',
                '✓ Tailored to your skin type',
                '✓ No shortcuts, ever',
              ].map(item => (
                <p key={item} className="sidebar-point">{item}</p>
              ))}
            </div>

            <div className="sidebar-card reveal reveal-delay-2">
              <h3>Prefer WhatsApp?</h3>
              <p style={{ color: 'var(--warm-grey)', marginBottom: '16px', fontSize: '0.9rem' }}>
                Message us directly on WhatsApp for faster responses.
              </p>
              {whatsappNum && (
                <a
                  href={`https://wa.me/${whatsappNum}?text=Hello%20Lana%20Eclat%2C%20I%20would%20like%20to%20book%20an%20appointment.`}
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-btn"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.294 22l4.979-1.125A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.953 7.953 0 01-4.184-1.186l-.3-.178-3.115.703.74-2.987-.196-.307A7.954 7.954 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              )}
            </div>

            <div className="sidebar-card reveal reveal-delay-3">
              <h3>Business Hours</h3>
              {[
                { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM' },
                { day: 'Saturday', hours: '9:00 AM – 6:00 PM' },
                { day: 'Sunday', hours: 'By appointment only' },
              ].map(h => (
                <div key={h.day} className="hours-row">
                  <span>{h.day}</span>
                  <span className="hours-val">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="map-section">
        <div className="container">
          <div className="map-header reveal">
            <p className="section-label">Find Us</p>
            <h2>We're in <em>Kabba, Kogi State</em></h2>
          </div>
          <div className="map-wrapper reveal reveal-delay-1">
            <iframe
              title="Lana Eclat Beauty Studio Location"
              src={mapEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '20px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {!ENV.googleMapsApiKey && (
              <div className="map-overlay-note">
                <p>📍 Add your <code>REACT_APP_GOOGLE_MAPS_API_KEY</code> in <code>.env</code> for an interactive map</p>
              </div>
            )}
          </div>
          <div className="map-address reveal reveal-delay-2">
            <span>📍 {ENV.location}</span>
            <a
              href={`https://maps.google.com/?q=${ENV.mapLat},${ENV.mapLng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
