import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Gallery.css';

interface GalleryItem {
  id: string | number
  url?: string
  emoji?: string
  color?: string
  label: string
  cat: string
}

// Fallback placeholders shown until real images are uploaded
const placeholders: GalleryItem[] = [
  { id: 1, emoji: '🌸', label: 'Deep Cleansing Session', color: 'linear-gradient(135deg, #f5c5d0, #e8849e)', cat: 'treatments' },
  { id: 2, emoji: '💧', label: 'Hydrating Facial', color: 'linear-gradient(135deg, #c8e8f0, #a0c8e0)', cat: 'treatments' },
  { id: 3, emoji: '✨', label: 'Glow Transformation', color: 'linear-gradient(135deg, #f0d080, #e8b040)', cat: 'results' },
  { id: 4, emoji: '🌿', label: 'Acne Treatment', color: 'linear-gradient(135deg, #c8e0c0, #a0c890)', cat: 'treatments' },
  { id: 5, emoji: '🌙', label: 'Dark Spot Correction', color: 'linear-gradient(135deg, #d0c0e8, #b0a0d0)', cat: 'results' },
  { id: 6, emoji: '⏳', label: 'Anti-Aging Session', color: 'linear-gradient(135deg, #f5c5d0, #c8537a)', cat: 'treatments' },
];

const categories = ['all', 'treatments', 'results', 'studio'];

export default function Gallery() {
  const [cat, setCat] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(placeholders);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const revealRef = useScrollReveal();

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setGalleryItems(data.map(d => ({
            id: d.id,
            url: d.url,
            label: d.label,
            cat: d.category,
          })))
        }
        // If no images uploaded yet, keep showing placeholders
      })
  }, [])

  const filtered = cat === 'all' ? galleryItems : galleryItems.filter(g => g.cat === cat);

  return (
    <main className="gallery-page" ref={revealRef as any}>
      {/* Header */}
      <section className="page-header">
        <div className="page-header-bg" />
        <div className="container page-header-content">
          <p className="section-label reveal">Our Work</p>
          <h1 className="reveal reveal-delay-1">The <em>Gallery</em></h1>
          <div className="deco-line reveal reveal-delay-2"><div className="deco-diamond-sm" /></div>
          <p className="page-subtitle reveal reveal-delay-2">
            Real sessions. Real transformations. Real glow.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="gallery-filters container">
        {categories.map(c => (
          <button
            key={c}
            className={`filter-btn ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="section-pad" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className="gallery-grid">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="gallery-item reveal"
                style={{ '--i': i, transitionDelay: `${i * 0.05}s` } as any}
                onClick={() => setLightbox(item)}
              >
                <div className="gallery-thumb" style={{ background: item.url ? undefined : item.color }}>
                  {item.url
                    ? <img src={item.url} alt={item.label} loading="lazy" className="gallery-img" />
                    : <span className="gallery-emoji">{item.emoji}</span>
                  }
                  <div className="gallery-overlay">
                    <span className="gallery-label">{item.label}</span>
                    <span className="gallery-view">View ↗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="gallery-note reveal" style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ color: 'var(--warm-grey)', fontStyle: 'italic' }}>
              📸 Add your real client photos to the gallery by updating the gallery data file.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="lightbox-thumb" style={{ background: lightbox.url ? undefined : lightbox.color }}>
              {lightbox.url
                ? <img src={lightbox.url} alt={lightbox.label} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                : <span>{lightbox.emoji}</span>
              }
            </div>
            <div className="lightbox-info">
              <h3>{lightbox.label}</h3>
              <span className="lightbox-cat">{lightbox.cat}</span>
              <p style={{ color: 'var(--warm-grey)', marginTop: '12px' }}>
                A beautiful session at Lana Éclat Beauty Studio, Kabba, Kogi State.
              </p>
            </div>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </main>
  );
}
