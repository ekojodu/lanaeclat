import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Booking } from '../../lib/supabase'
import './AdminDashboard.css'
import './AdminBookings.css'

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setBookings(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: Booking['status']) => {
    setUpdating(id)
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    }
    setUpdating(null)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats row */}
      <div className="bookings-stats">
        {[
          { label: 'Total',     value: counts.all,       color: 'var(--charcoal)' },
          { label: 'Pending',   value: counts.pending,   color: '#b7791f' },
          { label: 'Confirmed', value: counts.confirmed, color: '#276749' },
          { label: 'Completed', value: counts.completed, color: '#553c9a' },
          { label: 'Cancelled', value: counts.cancelled, color: '#cc3333' },
        ].map(s => (
          <div key={s.label} className="booking-stat-card">
            <span className="booking-stat-num" style={{ color: s.color }}>{s.value}</span>
            <span className="booking-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-count">{counts[f as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div className="loading-spinner">⏳ Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No {filter === 'all' ? '' : filter} bookings yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Contact</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(booking => (
                  <tr key={booking.id}>
                    <td>
                      <strong style={{ display: 'block' }}>{booking.client_name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--warm-grey)' }}>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ maxWidth: '160px' }}>
                      <span style={{ fontSize: '0.85rem' }}>{booking.service_name}</span>
                    </td>
                    <td>
                      <strong style={{ display: 'block' }}>{booking.preferred_date}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--warm-grey)' }}>
                        {booking.preferred_time}
                      </span>
                    </td>
                    <td>
                      <a href={`mailto:${booking.client_email}`} style={{ display: 'block', fontSize: '0.82rem', color: 'var(--rose-mid)' }}>
                        {booking.client_email}
                      </a>
                      {booking.client_phone && (
                        <a href={`tel:${booking.client_phone}`} style={{ fontSize: '0.78rem', color: 'var(--warm-grey)' }}>
                          {booking.client_phone}
                        </a>
                      )}
                    </td>
                    <td style={{ maxWidth: '140px', fontSize: '0.82rem', color: 'var(--warm-grey)' }}>
                      {booking.notes || '—'}
                    </td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {booking.status !== 'confirmed' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <button
                            className="admin-btn admin-btn-confirm"
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            disabled={updating === booking.id}
                          >
                            ✓ Confirm
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            className="admin-btn admin-btn-complete"
                            onClick={() => updateStatus(booking.id, 'completed')}
                            disabled={updating === booking.id}
                          >
                            ✦ Complete
                          </button>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            className="admin-btn admin-btn-cancel"
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            disabled={updating === booking.id}
                          >
                            ✕ Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
