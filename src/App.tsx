import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import { useAuth } from './admin/hooks/useAuth'
import './styles/globals.css'

// Lazy load all pages for performance
const Home                = lazy(() => import('./pages/Home'))
const About               = lazy(() => import('./pages/About'))
const Services            = lazy(() => import('./pages/Services'))
const Gallery             = lazy(() => import('./pages/Gallery'))
const Contact             = lazy(() => import('./pages/Contact'))
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'))
const AdminLogin          = lazy(() => import('./admin/pages/AdminLogin'))
const AdminDashboard      = lazy(() => import('./admin/pages/AdminDashboard'))

// Page meta config
const PAGE_META: Record<string, { title: string; description: string }> = {
  '/':                      { title: 'Lana Éclat | Luxury Facial Studio in Kabba, Kogi State', description: 'Lana Éclat is a luxury skincare and facial studio in Kabba, Kogi State Nigeria. Book your glow today.' },
  '/services':              { title: 'Facial Treatments | Lana Éclat Beauty Studio', description: 'Explore our facial treatments — Hydrating, Brightening, Acne Control, Exfoliating and Anti-Ageing facials in Kabba, Kogi State.' },
  '/contact':               { title: 'Book an Appointment | Lana Éclat Beauty Studio', description: 'Book your facial appointment at Lana Éclat in Kabba, Kogi State. Secure your slot online today.' },
  '/about':                 { title: 'About Us | Lana Éclat Beauty Studio', description: 'Learn about Lana Éclat — our story, our values, and our passion for skin health in Kabba, Kogi State.' },
  '/gallery':               { title: 'Gallery | Lana Éclat Beauty Studio', description: 'See the Lana Éclat experience — our studio, treatments and client results.' },
  '/booking-confirmation':  { title: 'Booking Received | Lana Éclat Beauty Studio', description: 'Your appointment request has been received. We will confirm your slot shortly.' },
}

function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = PAGE_META[pathname] ?? PAGE_META['/']
    document.title = meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', meta.description)
  }, [pathname])
  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif', color: 'var(--rose-mid, #c8537a)', fontSize: '1.5rem' }}>
    ✦
  </div>
)

function AdminRoute() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Jost, sans-serif', color: '#c8537a' }}>
      Loading...
    </div>
  )

  if (!user) return <AdminLogin />

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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el))
    }

    // Observe immediately + after short delay for async-rendered content
    observe()
    const t1 = setTimeout(observe, 100)
    const t2 = setTimeout(observe, 500)

    // Also watch for DOM changes (e.g. data loaded from Supabase)
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { io.disconnect(); mo.disconnect(); clearTimeout(t1); clearTimeout(t2) }
  }, [pathname])

  const isAdminPath = pathname === '/admin'

  return (
    <>
      <Cursor />
      {!isAdminPath && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                     element={<Home />} />
          <Route path="/about"                element={<About />} />
          <Route path="/services"             element={<Services />} />
          <Route path="/gallery"              element={<Gallery />} />
          <Route path="/contact"              element={<Contact />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/admin"                element={<AdminRoute />} />
          <Route path="*"                     element={<Home />} />
        </Routes>
      </Suspense>
      {!isAdminPath && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <PageMeta />
      <AppContent />
    </Router>
  )
}
