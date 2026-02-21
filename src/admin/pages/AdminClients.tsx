import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Booking } from '../../lib/supabase'
import './AdminDashboard.css'

interface ClientSummary {
  email: string
  name: string
  phone: string
  totalBookings: number
  lastBooking: string
  lastService: string
}

export default function AdminClients() {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      // Group by email to build client list
      const map = new Map<string, ClientSummary>()
      data.forEach((b: Booking) => {
        if (!map.has(b.client_email)) {
          map.set(b.client_email, {
            email: b.client_email,
            name: b.client_name,
            phone: b.client_phone || '',
            totalBookings: 1,
            lastBooking: b.preferred_date,
            lastService: b.service_name,
          })
        } else {
          const c = map.get(b.client_email)!
          c.totalBookings++
        }
      })
      setClients(Array.from(map.values()))
    }
    setLoading(false)
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="admin-card" style={{ padding: '16px 24px' }}>
        <input
          type="text"
          placeholder="🔍  Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            border: '1.5px solid var(--rose-blush)',
            borderRadius: '10px',
            padding: '10px 16px',
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.9rem',
            outline: 'none',
            color: 'var(--charcoal)',
          }}
        />
      </div>

      <div className="admin-card">
        <div className="admin-card-title">
          {clients.length} Total Clients
        </div>
        {loading ? (
          <div className="loading-spinner">⏳ Loading clients...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <p>No clients found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Bookings</th>
                  <th>Last Service</th>
                  <th>Last Booking</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr key={client.email}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--rose-deep), var(--rose-mid))',
                          color: 'white', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '0.82rem', fontWeight: '600',
                          flexShrink: 0,
                        }}>
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{client.name}</strong>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${client.email}`} style={{ color: 'var(--rose-mid)', fontSize: '0.85rem' }}>
                        {client.email}
                      </a>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--warm-grey)' }}>
                      {client.phone || '—'}
                    </td>
                    <td>
                      <span style={{
                        background: 'var(--rose-pearl)', color: 'var(--rose-deep)',
                        padding: '3px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600',
                      }}>
                        {client.totalBookings}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{client.lastService}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--warm-grey)' }}>{client.lastBooking}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a href={`mailto:${client.email}`} className="admin-btn admin-btn-edit">
                          ✉ Email
                        </a>
                        {client.phone && (
                          <a href={`https://wa.me/${client.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="admin-btn" style={{ background: '#e6f7ee', color: '#276749' }}>
                            WhatsApp
                          </a>
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
