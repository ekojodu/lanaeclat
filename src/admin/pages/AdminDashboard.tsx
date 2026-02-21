import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import AdminBookings from './AdminBookings'
import AdminClients from './AdminClients'
import AdminAnalytics from './AdminAnalytics'
import AdminPricelist from './AdminPricelist'
import './AdminDashboard.css'

type Tab = 'bookings' | 'clients' | 'analytics' | 'pricelist'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('bookings')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems: { key: Tab; label: string; icon: string }[] = [
    { key: 'bookings',  label: 'Bookings',   icon: '📋' },
    { key: 'clients',   label: 'Clients',    icon: '👤' },
    { key: 'analytics', label: 'Analytics',  icon: '📊' },
    { key: 'pricelist', label: 'Pricelist',  icon: '💰' },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">Lana Éclat</span>
          <span className="sidebar-sub">Admin Portal</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`sidebar-link ${tab === item.key ? 'active' : ''}`}
              onClick={() => { setTab(item.key); setSidebarOpen(false) }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-email">{user?.email}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          </div>
          <button className="sidebar-signout" onClick={signOut} title="Sign out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="hamburger-admin" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span /><span /><span />
          </button>
          <h1 className="admin-page-title">
            {navItems.find(n => n.key === tab)?.icon}{' '}
            {navItems.find(n => n.key === tab)?.label}
          </h1>
          <a href="/" target="_blank" rel="noreferrer" className="view-site-btn">
            View Site ↗
          </a>
        </header>

        <div className="admin-content">
          {tab === 'bookings'  && <AdminBookings />}
          {tab === 'clients'   && <AdminClients />}
          {tab === 'analytics' && <AdminAnalytics />}
          {tab === 'pricelist' && <AdminPricelist />}
        </div>
      </div>
    </div>
  )
}
