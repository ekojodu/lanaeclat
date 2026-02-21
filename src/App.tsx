import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import './styles/globals.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  const { pathname } = useLocation();

  // Setup global scroll reveal — re-runs on route change only
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop watching once visible — prevents re-triggering on re-renders
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    // Small delay to let the page render before observing
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal:not(.visible)');
      els.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="*"         element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}