import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { Booking } from '../../lib/supabase'
import './AdminDashboard.css'
import './AdminAnalytics.css'

export default function AdminAnalytics() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('bookings').select('*').then(({ data }) => {
      if (data) setBookings(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="loading-spinner">⏳ Loading analytics...</div>

  // ===== Compute stats =====
  const total = bookings.length
  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const completed = bookings.filter(b => b.status === 'completed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length
  const pending = bookings.filter(b => b.status === 'pending').length

  // Service popularity
  const serviceCounts: Record<string, number> = {}
  bookings.forEach(b => {
    serviceCounts[b.service_name] = (serviceCounts[b.service_name] || 0) + 1
  })
  const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])
  const maxServiceCount = sortedServices[0]?.[1] || 1

  // Bookings by month (last 6 months)
  const monthCounts: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    monthCounts[key] = 0
  }
  bookings.forEach(b => {
    const d = new Date(b.created_at)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    if (key in monthCounts) monthCounts[key]++
  })
  const monthData = Object.entries(monthCounts)
  const maxMonth = Math.max(...monthData.map(m => m[1]), 1)

  // Unique clients
  const uniqueClients = new Set(bookings.map(b => b.client_email)).size

  const conversionRate = total > 0 ? Math.round(((confirmed + completed) / total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div className="analytics-kpis">
        {[
          { label: 'Total Bookings', value: total, icon: '📋', color: 'var(--rose-deep)' },
          { label: 'Unique Clients', value: uniqueClients, icon: '👤', color: '#553c9a' },
          { label: 'Completed', value: completed, icon: '✦', color: '#276749' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, icon: '📈', color: '#b7791f' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-icon">{kpi.icon}</div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="analytics-grid">
        {/* Bookings by Month */}
        <div className="admin-card">
          <div className="admin-card-title">Bookings by Month</div>
          {total === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📊</div><p>No data yet.</p></div>
          ) : (
            <div className="bar-chart">
              {monthData.map(([month, count]) => (
                <div key={month} className="bar-item">
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ height: `${(count / maxMonth) * 100}%` }}
                    />
                  </div>
                  <span className="bar-count">{count}</span>
                  <span className="bar-label">{month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="admin-card">
          <div className="admin-card-title">Booking Status</div>
          {total === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📊</div><p>No data yet.</p></div>
          ) : (
            <div className="status-breakdown">
              {[
                { label: 'Pending',   count: pending,   color: '#b7791f', bg: '#fff8e6' },
                { label: 'Confirmed', count: confirmed, color: '#276749', bg: '#e6f7ee' },
                { label: 'Completed', count: completed, color: '#553c9a', bg: '#f0f0ff' },
                { label: 'Cancelled', count: cancelled, color: '#cc3333', bg: '#fff0f0' },
              ].map(s => (
                <div key={s.label} className="status-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', color: s.color }}>{s.label}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--warm-grey)' }}>{s.count} / {total}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${total > 0 ? (s.count / total) * 100 : 0}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Most Popular Services */}
      <div className="admin-card">
        <div className="admin-card-title">Most Popular Services</div>
        {sortedServices.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🌸</div><p>No bookings yet.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedServices.map(([name, count], i) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--charcoal)' }}>
                    {i === 0 && '🥇 '}{i === 1 && '🥈 '}{i === 2 && '🥉 '}{name}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--warm-grey)' }}>{count} booking{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(count / maxServiceCount) * 100}%`,
                      background: 'linear-gradient(to right, var(--rose-deep), var(--rose-mid))',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
