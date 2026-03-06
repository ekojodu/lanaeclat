import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { bustServicesCache } from '../../lib/servicesCache'
import type { Service } from '../../lib/supabase'
import './AdminDashboard.css'
import './AdminPricelist.css'
import './AdminServices.css'

const EMOJIS = ['🌸','💧','✨','🌿','🌙','⏳','🕊️','✦','🌊','💆','🌺','🧴','💎','🌟','🫶','🌻']

const blankService = (): Partial<Service> => ({
  name: '',
  description: '',
  duration: '',
  price: 0,
  emoji: '🌸',
  highlight: '',
  active: true,
})

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Service>>({})
  const [saved, setSaved] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newService, setNewService] = useState<Partial<Service>>(blankService())
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (data) setServices(data)
    setLoading(false)
  }

  // ===== ADD =====
  const handleAdd = async () => {
    setAddError('')
    if (!newService.name?.trim()) return setAddError('Service name is required')
    if (!newService.description?.trim()) return setAddError('Description is required')
    if (!newService.duration?.trim()) return setAddError('Duration is required')
    if (!newService.emoji?.trim()) return setAddError('Please select an emoji')

    setAdding(true)
    const id = newService.name!.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)

    const payload = {
      id: `${id}-${Date.now()}`,
      name: newService.name!.trim(),
      description: newService.description!.trim(),
      duration: newService.duration!.trim(),
      price: newService.price ?? 0,
      emoji: newService.emoji!,
      highlight: newService.highlight?.trim() || null,
      active: newService.active ?? true,
      sort_order: services.length,
    }

    const { error } = await supabase.from('services').insert(payload)
    if (!error) bustServicesCache()
    if (error) {
      setAddError('Failed to add: ' + error.message)
    } else {
      setNewService(blankService())
      setShowAddForm(false)
      fetchServices()
    }
    setAdding(false)
  }

  // ===== EDIT =====
  const startEdit = (service: Service) => {
    setEditing(service.id)
    setEditData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      emoji: service.emoji,
      highlight: service.highlight,
      active: service.active,
    })
  }

  const cancelEdit = () => { setEditing(null); setEditData({}) }

  const saveService = async (id: string) => {
    setSaving(id)
    const { error } = await supabase.from('services').update(editData).eq('id', id)
    if (!error) {
      bustServicesCache()
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...editData } : s))
      setSaved(id)
      setTimeout(() => setSaved(null), 2000)
    }
    setEditing(null)
    setEditData({})
    setSaving(null)
  }

  // ===== DELETE =====
  const deleteService = async (service: Service) => {
    if (!confirm(`Delete "${service.name}"? This cannot be undone.`)) return
    setDeleting(service.id)
    await supabase.from('services').delete().eq('id', service.id)
    bustServicesCache()
    setServices(prev => prev.filter(s => s.id !== service.id))
    setDeleting(null)
  }

  // ===== SORT =====
  const moveService = async (index: number, direction: 'up' | 'down') => {
    const newServices = [...services]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newServices.length) return

    ;[newServices[index], newServices[swapIndex]] = [newServices[swapIndex], newServices[index]]

    // Update sort_order for both
    const updates = newServices.map((s, i) => ({ id: s.id, sort_order: i }))
    setServices(newServices)

    await Promise.all(
      updates.map(u => supabase.from('services').update({ sort_order: u.sort_order }).eq('id', u.id))
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Info + Add button */}
      <div className="admin-card" style={{ padding: '16px 24px', background: 'linear-gradient(135deg, var(--rose-pearl), white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--warm-grey)', margin: 0 }}>
          💡 Changes here reflect instantly on the website and booking form. Use ↑↓ to reorder services.
        </p>
        <button
          className="admin-btn admin-btn-confirm"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
          onClick={() => { setShowAddForm(!showAddForm); setAddError('') }}
        >
          {showAddForm ? '✕ Cancel' : '＋ Add New Service'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="admin-card service-add-form">
          <div className="admin-card-title">New Service</div>
          <div className="service-form-grid">
            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                placeholder="e.g. Brightening Facial"
                value={newService.name ?? ''}
                onChange={e => setNewService(d => ({ ...d, name: e.target.value }))}
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                placeholder="e.g. 60 mins"
                value={newService.duration ?? ''}
                onChange={e => setNewService(d => ({ ...d, duration: e.target.value }))}
                maxLength={20}
              />
            </div>
            <div className="form-group form-group-full">
              <label>Description *</label>
              <textarea
                placeholder="Describe what this treatment does for the client..."
                value={newService.description ?? ''}
                onChange={e => setNewService(d => ({ ...d, description: e.target.value }))}
                maxLength={500}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Price (₦)</label>
              <input
                type="number"
                placeholder="0"
                value={newService.price ?? 0}
                onChange={e => setNewService(d => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
                min={0}
                step={100}
              />
            </div>
            <div className="form-group">
              <label>Badge (optional)</label>
              <input
                type="text"
                placeholder="e.g. Most Popular"
                value={newService.highlight ?? ''}
                onChange={e => setNewService(d => ({ ...d, highlight: e.target.value }))}
                maxLength={30}
              />
            </div>
            <div className="form-group form-group-full">
              <label>Emoji</label>
              <div className="emoji-picker">
                {EMOJIS.map(em => (
                  <button
                    key={em}
                    className={`emoji-option ${newService.emoji === em ? 'selected' : ''}`}
                    onClick={() => setNewService(d => ({ ...d, emoji: em }))}
                    type="button"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="price-toggle" style={{ marginTop: '8px' }}>
                <input
                  type="checkbox"
                  checked={newService.active ?? true}
                  onChange={e => setNewService(d => ({ ...d, active: e.target.checked }))}
                />
                <span>Active (visible on website)</span>
              </label>
            </div>
          </div>

          {addError && <div className="auth-error" style={{ marginTop: '12px' }}>⚠ {addError}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              className="admin-btn admin-btn-confirm"
              onClick={handleAdd}
              disabled={adding}
              style={{ padding: '10px 24px' }}
            >
              {adding ? '⏳ Adding...' : '✓ Add Service'}
            </button>
            <button
              className="admin-btn"
              style={{ background: '#f0e8ec', color: 'var(--warm-grey)', padding: '10px 24px' }}
              onClick={() => { setShowAddForm(false); setNewService(blankService()); setAddError('') }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="admin-card">
        <div className="admin-card-title">{services.length} Services</div>
        {loading ? (
          <div className="loading-spinner">⏳ Loading services...</div>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌸</div>
            <p>No services yet. Add your first one above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {services.map((service, index) => (
              <div key={service.id} className={`price-row ${editing === service.id ? 'editing' : ''}`}>
                <div className="price-row-main">

                  {/* Sort arrows */}
                  <div className="sort-arrows">
                    <button
                      className="sort-btn"
                      onClick={() => moveService(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >↑</button>
                    <button
                      className="sort-btn"
                      onClick={() => moveService(index, 'down')}
                      disabled={index === services.length - 1}
                      title="Move down"
                    >↓</button>
                  </div>

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
                      <div className="price-edit-form" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '180px' }}>
                            <label className="edit-label">Name</label>
                            <input
                              type="text"
                              value={editData.name ?? ''}
                              onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                              className="price-badge-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: '100px' }}>
                            <label className="edit-label">Duration</label>
                            <input
                              type="text"
                              value={editData.duration ?? ''}
                              onChange={e => setEditData(d => ({ ...d, duration: e.target.value }))}
                              className="price-badge-input"
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                        <div style={{ width: '100%' }}>
                          <label className="edit-label">Description</label>
                          <textarea
                            value={editData.description ?? ''}
                            onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                            className="price-badge-input"
                            style={{ width: '100%', minHeight: '80px', resize: 'vertical' }}
                            maxLength={500}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <div>
                            <label className="edit-label">Price (₦)</label>
                            <div className="price-input-group">
                              <span className="price-currency">₦</span>
                              <input
                                type="number"
                                value={editData.price ?? service.price}
                                onChange={e => setEditData(d => ({ ...d, price: parseFloat(e.target.value) || 0 }))}
                                min="0"
                                step="100"
                                className="price-input"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="edit-label">Badge</label>
                            <input
                              type="text"
                              value={editData.highlight ?? service.highlight ?? ''}
                              onChange={e => setEditData(d => ({ ...d, highlight: e.target.value || null }))}
                              placeholder="e.g. Most Popular"
                              className="price-badge-input"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="edit-label">Emoji</label>
                          <div className="emoji-picker">
                            {EMOJIS.map(em => (
                              <button
                                key={em}
                                className={`emoji-option ${(editData.emoji ?? service.emoji) === em ? 'selected' : ''}`}
                                onClick={() => setEditData(d => ({ ...d, emoji: em }))}
                                type="button"
                              >
                                {em}
                              </button>
                            ))}
                          </div>
                        </div>
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
                          <button
                            className="admin-btn"
                            style={{ background: '#f0e8ec', color: 'var(--warm-grey)' }}
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <span className="price-display">
                          {service.price > 0
                            ? `₦${service.price.toLocaleString()}`
                            : <span style={{ color: 'var(--warm-grey)', fontSize: '0.85rem' }}>No price</span>
                          }
                        </span>
                        {saved === service.id && (
                          <span style={{ color: '#276749', fontSize: '0.8rem' }}>✓ Saved!</span>
                        )}
                        <button className="admin-btn admin-btn-edit" onClick={() => startEdit(service)}>
                          ✎ Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-cancel"
                          onClick={() => deleteService(service)}
                          disabled={deleting === service.id}
                        >
                          {deleting === service.id ? '...' : '🗑'}
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
