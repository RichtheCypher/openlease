import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Wordmark */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px'
          }}>
            <Home size={17} strokeWidth={2} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)'
            }}>
              OpenLeasewithus
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              lineHeight: 1,
              marginTop: '1px'
            }}>
              Residential Leasing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <Link
            to="/testimonials"
            style={{
              fontSize: '0.875rem',
              fontWeight: isActive('/testimonials') ? 600 : 400,
              color: isActive('/testimonials') ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            Testimonials
          </Link>
          <Link
            to="/about"
            style={{
              fontSize: '0.875rem',
              fontWeight: isActive('/about') ? 600 : 400,
              color: isActive('/about') ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            style={{
              fontSize: '0.875rem',
              fontWeight: isActive('/contact') ? 600 : 400,
              color: isActive('/contact') ? 'var(--text-primary)' : 'var(--text-secondary)'
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA / Admin Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-cta">
          <Link to="/apply" className="btn btn-primary btn-sm">
            Apply Now
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--text-primary)',
            display: 'none'
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-light)',
          padding: '1.25rem 1.5rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            to="/testimonials"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.4rem 0' }}
          >
            Testimonials
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.4rem 0' }}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', color: 'var(--text-primary)', padding: '0.4rem 0' }}
          >
            Contact
          </Link>
          <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '0.25rem 0' }} />
          <Link
            to="/apply"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary btn-block"
          >
            Apply for a Home
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-cta {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
