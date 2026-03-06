import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service } from '../lib/supabase';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Services.css';

function toWords(n: number): string {
  const words = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'];
  return words[n] ?? `${n}`;
}

export default function Services() {
  const [active, setActive] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const revealRef = useScrollReveal();

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
      .then(({ data }) => {
        if (data) setServices(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className='services-page' ref={revealRef as any}>
      {/* Header */}
      <section className='page-header'>
        <div className='page-header-bg' />
        <div className='container page-header-content'>
          <p className='section-label reveal'>What We Offer</p>
          <h1 className='reveal reveal-delay-1'>Our <em>Treatments</em></h1>
          <div className='deco-line reveal reveal-delay-2'><div className='deco-diamond-sm' /></div>
          <p className='page-subtitle reveal reveal-delay-2'>
            {loading
              ? 'Expertly crafted facials for every skin type and concern.'
              : `${toWords(services.length)} expertly crafted facial${services.length !== 1 ? 's' : ''} for every skin type and concern.`
            }
          </p>
        </div>
      </section>

      {/* Process Banner */}
      <div className='process-banner'>
        {['Consultation', '→', 'Custom Treatment', '→', 'Aftercare Advice', '→', 'Glowing Skin ✦'].map((item, i) => (
          <span key={i} className={item === '→' ? 'process-arrow' : 'process-step'}>{item}</span>
        ))}
      </div>

      {/* Treatments */}
      <section className='section-pad'>
        <div className='container'>
          <div className='section-header reveal' style={{ textAlign: 'left' }}>
            <p className='section-label'>All Services</p>
            <h2>Choose your skin journey</h2>
            <div className='deco-line' style={{ justifyContent: 'flex-start' }}>
              <div className='deco-diamond-sm' />
            </div>
          </div>

          <div className='services-list'>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--warm-grey)', fontFamily: 'Jost, sans-serif' }}>
                ⏳ Loading treatments...
              </div>
            ) : services.map((t, i) => (
              <div
                key={t.id}
                className={`service-item ${active === t.id ? 'expanded' : ''}`}
                style={{ '--i': i } as any}
              >
                <div className='service-row' onClick={() => setActive(active === t.id ? null : t.id)}>
                  <div className='service-left'>
                    <span className='service-num'>0{i + 1}</span>
                    <span className='service-emoji-sm'>{t.emoji}</span>
                    <div>
                      <h3 className='service-name'>{t.name}</h3>
                      {t.highlight && <span className='service-tag'>{t.highlight}</span>}
                    </div>
                  </div>
                  <div className='service-right'>
                    <span className='service-dur'>⏱ {t.duration}</span>
                    <div className={`service-toggle ${active === t.id ? 'open' : ''}`}>
                      <span /><span />
                    </div>
                  </div>
                </div>

                <div className={`service-body ${active === t.id ? 'open' : ''}`}>
                  <p>{t.description}</p>
                  <div className='service-body-actions'>
                    <Link to='/contact' className='btn-primary' style={{ padding: '10px 28px' }}>
                      <span>Book This Treatment</span>
                    </Link>
                    <span className='service-duration-note'>Session: {t.duration}</span>
                    {t.price != null && t.price > 0 && (
                      <span className='service-price'>₦{t.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className='section-pad promise-section'>
        <div className='container'>
          <div className='promise-grid'>
            {[
              { icon: '🧴', title: 'Premium Products', desc: 'Every product we use is carefully selected for safety, efficacy, and skin compatibility.' },
              { icon: '🧪', title: 'Sterilized Tools',  desc: 'All tools are thoroughly cleaned and sterilized before each session. Always.' },
              { icon: '🎓', title: 'Trained Hands',     desc: 'Our treatments are performed by trained, passionate estheticians who care.' },
              { icon: '💌', title: 'Aftercare Support', desc: "We guide you through your at-home routine to prolong every session's results." },
            ].map((p, i) => (
              <div key={p.title} className={`promise-card reveal reveal-delay-${i + 1}`}>
                <span className='promise-icon'>{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='section-pad' style={{ textAlign: 'center', background: 'var(--rose-pearl)' }}>
        <div className='container reveal'>
          <p className='section-label'>Ready?</p>
          <h2 style={{ marginBottom: '12px' }}>
            First-time clients get a <em style={{ color: 'var(--rose-deep)' }}>special offer</em>
          </h2>
          <p style={{ color: 'var(--warm-grey)', marginBottom: '32px', maxWidth: '500px', margin: '12px auto 32px' }}>
            Limited slots available. Book early to secure your spot and your glow.
          </p>
          <Link to='/contact' className='btn-primary'><span>✦ Book Appointment Now</span></Link>
        </div>
      </section>
    </main>
  );
}
