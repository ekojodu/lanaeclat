import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Service } from '../../lib/supabase'
import './AdminDashboard.css'
import './AdminPricelist.css'

export default function AdminPricelist() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Service>>({})
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (!error && data) setServices(data)
    setLoading(false)
  }

  const startEdit = (service: Service) => {
    setEditing(service.id)
    setEditData({ price: service.price, highlight: service.highlight, active: service.active })
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditData({})
  }

  const saveService = async (id: string) => {
    setSaving(id)
    const { error } = await supabase
      .from('services')
      .update(editData)
      .eq('id', id)

    if (!error) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...editData } : s))
      setSaved(id)
      setTimeout(() => setSaved(null), 2000)
    }
    setEditing(null)
    setEditData({})
    setSaving(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="admin-card" style={{ padding: '16px 24px', background: 'linear-gradient(135deg, var(--rose-pearl), white)' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--warm-grey)', margin: 0 }}>
          💡 Prices updated here will automatically reflect on the public website. Click the edit icon on any service to update its price or badge.
        </p>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">Service Pricelist</div>
        {loading ? (
          <div className="loading-spinner">⏳ Loading services...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {services.map(service => (
              <div key={service.id} className={`price-row ${editing === service.id ? 'editing' : ''}`}>
                <div className="price-row-main">
                  <div className="price-service-info">
                    <span className="price-emoji">{service.emoji}</span>
                    <div>
                      <div className="price-service-name">{service.name}</div>
                      <div className="price-service-meta">
                        <span>{service.duration}</span>
                        {service.highlight && (
                          <span className="price-badge">{service.highlight}</span>
                        )}
                        <span className={`price-active ${service.active ? 'yes' : 'no'}`}>
                          {service.active ? '● Active' : '● Hidden'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="price-right">
                    {editing === service.id ? (
                      <div className="price-edit-form">
                        <div className="price-input-group">
                          <span className="price-currency">₦</span>
                          <input
                            type="number"
                            value={editData.price ?? service.price}
                            onChange={e => setEditData(d => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                            min="0"
                            step="100"
                            className="price-input"
                          />
                        </div>
                        <input
                          type="text"
                          value={editData.highlight ?? service.highlight ?? ''}
                          onChange={e => setEditData(d => ({ ...d, highlight: e.target.value || null }))}
                          placeholder="Badge (e.g. Most Popular)"
                          className="price-badge-input"
                        />
                        <label className="price-toggle">
                          <input
                            type="checkbox"
                            checked={editData.active ?? service.active}
                            onChange={e => setEditData(d => ({ ...d, active: e.target.checked }))}
                          />
                          <span>Active</span>
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="admin-btn admin-btn-confirm"
                            onClick={() => saveService(service.id)}
                            disabled={saving === service.id}
                          >
                            {saving === service.id ? '...' : '✓ Save'}
                          </button>
                          <button className="admin-btn" style={{ background: '#f0e8ec', color: 'var(--warm-grey)' }} onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="price-display">
                          {service.price > 0
                            ? `₦${service.price.toLocaleString()}`
                            : <span style={{ color: 'var(--warm-grey)', fontSize: '0.85rem' }}>Not set</span>
                          }
                        </span>
                        {saved === service.id && (
                          <span style={{ color: '#276749', fontSize: '0.8rem' }}>✓ Saved!</span>
                        )}
                        <button
                          className="admin-btn admin-btn-edit"
                          onClick={() => startEdit(service)}
                        >
                          ✎ Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
