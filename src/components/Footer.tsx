import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-inverse)',
      paddingTop: '4.5rem',
      paddingBottom: '3rem',
      borderTop: '1px solid var(--border-dark)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem 2rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid var(--border-dark)'
        }}>
          {/* Col 1: Brand & Bio */}
          <div style={{ maxWidth: '340px' }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              color: '#FFFFFF',
              marginBottom: '0.85rem'
            }}>
              OpenLeasewithus
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#A6A095',
              lineHeight: 1.65,
              marginBottom: '1.25rem'
            }}>
              Residential leasing across verified single-family homes and townhomes in premier US communities. Providing clear terms, straightforward applications, and direct communication.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8125rem',
              color: '#D4CEBF',
              padding: '0.35rem 0.65rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '2px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <CheckCircle2 size={13} color="#8FC7A5" />
              Equal Housing Opportunity
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              fontWeight: 600
            }}>
              Leasing & Homes
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/testimonials" style={{ color: '#A6A095' }} onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseOut={(e) => (e.currentTarget.style.color = '#A6A095')}>
                  Tenant Testimonials
                </Link>
              </li>
              <li>
                <Link to="/apply" style={{ color: '#A6A095' }} onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseOut={(e) => (e.currentTarget.style.color = '#A6A095')}>
                  Online Rental Application
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: '#A6A095' }} onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseOut={(e) => (e.currentTarget.style.color = '#A6A095')}>
                  Leasing Standards & Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div>
            <h4 style={{
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              fontWeight: 600
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/about" style={{ color: '#A6A095' }} onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseOut={(e) => (e.currentTarget.style.color = '#A6A095')}>
                  About OpenLeasewithus
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#A6A095' }} onMouseOver={(e) => (e.currentTarget.style.color = '#FFFFFF')} onMouseOut={(e) => (e.currentTarget.style.color = '#A6A095')}>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Inquiries & Email */}
          <div>
            <h4 style={{
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              fontWeight: 600
            }}>
              Direct Contact
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#A6A095', marginBottom: '0.85rem' }}>
              Questions about an active listing or your submitted application?
            </p>
            <a
              href="mailto:Openleasewithus@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 500,
                padding: '0.5rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'background 0.15s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <Mail size={15} />
              Openleasewithus@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.75rem',
          color: '#7D776E'
        }}>
          <div>
            &copy; {new Date().getFullYear()} OpenLeasewithus LLC. All rights reserved. US Residential Leasing.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Fair Housing Act Compliant</span>
            <span>US Residential Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
