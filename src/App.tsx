import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ApplyPage } from './pages/ApplyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminApplicationDetailPage } from './pages/AdminApplicationDetailPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout Wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/testimonials"
          element={
            <PublicLayout>
              <TestimonialsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/apply"
          element={
            <PublicLayout>
              <ApplyPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />

        {/* Private / Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/applications/:id" element={<AdminApplicationDetailPage />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
                <p className="text-secondary" style={{ margin: '1rem 0 2rem' }}>
                  The requested page does not exist.
                </p>
                <a href="/" className="btn btn-primary">
                  Return to Home
                </a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
