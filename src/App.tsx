import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import { useAuth } from './admin/hooks/useAuth'
import './styles/globals.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function AdminRoute() {
  const { user, isAdmin, loading } = useAuth()

  // Show loader until auth is fully resolved
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif', color: '#c8537a' }}>
      Loading...
    </div>
  )

  // Auth resolved — no user means show login
  if (!user) return <AdminLogin />

  // Auth resolved — user exists but not on whitelist
  if (!isAdmin) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif', gap: '12px' }}>
      <span style={{ fontSize: '2rem' }}>⛔</span>
      <p style={{ color: '#cc3333', fontWeight: 500 }}>Access denied. Your account is not authorised.</p>
    </div>
  )

  return <AdminDashboard />
}

function AppContent() {
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )

    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)')
      els.forEach((el) => observer.observe(el))
    }, 50)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [pathname])

  const isAdminPath = pathname === '/admin'

  return (
    <>
      <Cursor />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/admin"    element={<AdminRoute />} />
        <Route path="*"         element={<Home />} />
      </Routes>
      {!isAdminPath && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}
