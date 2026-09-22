import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, Users, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '6rem' }}>
      {/* Header */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        paddingTop: '3.5rem',
        paddingBottom: '3rem'
      }}>
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.35rem' }}>
            About OpenLeasewithus
          </span>
          <h1 style={{ marginBottom: '1rem' }}>Residential Leasing Built on Clarity and Trust</h1>
          <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.65 }}>
            OpenLeasewithus is an American residential leasing company dedicated to providing well-maintained homes and transparent rental experiences across growing US neighborhoods.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-narrow" style={{ marginTop: '3.5rem' }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          marginBottom: '2.5rem'
        }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Our Approach to Residential Leasing</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            Finding a home shouldn't be an impersonal process bogged down by hidden fees, confusing underwriting, or detached management. OpenLeasewithus operates with direct accountability: every home in our portfolio is personally vetted, accurately photographed, and backed by a responsive local leasing team.
          </p>

          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
            We work directly with individuals, families, and professionals seeking long-term residential stability. When you apply through OpenLeasewithus, your application is reviewed thoroughly by our team—never an automated algorithm that overlooks your context.
          </p>

          <div className="grid-2" style={{ gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)'
            }}>
              <div style={{ color: 'var(--accent-olive)', marginBottom: '0.5rem' }}>
                <Home size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Verified Quality Homes</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Each single-family home and townhome undergoes complete turn-inspection, HVAC servicing, and professional cleaning prior to occupancy.
              </p>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)'
            }}>
              <div style={{ color: 'var(--accent-olive)', marginBottom: '0.5rem' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Direct Human Review</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Our leasing team manually reviews all applications, income documentation, and references, keeping communication open and direct.
              </p>
            </div>
          </div>
        </div>

        {/* Standards & Commitment */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: 'clamp(1.5rem, 4vw, 3rem)'
        }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Equal Housing & Leasing Standards</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            OpenLeasewithus strictly complies with all federal, state, and local fair housing laws. We do not discriminate against any applicant based on race, color, religion, sex, national origin, familial status, disability, or any other legally protected class.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={16} color="var(--accent-olive)" />
              <span>Standardized 12-month residential lease agreements</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={16} color="var(--accent-olive)" />
              <span>Transparent deposit escrow and move-in checklists</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={16} color="var(--accent-olive)" />
              <span>Direct contact via Openleasewithus@gmail.com</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/properties" className="btn btn-primary">
              Browse Available Homes
              <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Our Office
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
