import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const HomePage: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 1. HERO SECTION */}
      <section style={{
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: 'var(--bg-main)'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem 2.5rem',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div style={{ maxWidth: '560px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--accent-olive)',
                marginBottom: '1rem',
                backgroundColor: 'var(--accent-olive-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: '2px'
              }}>
                <CheckCircle2 size={13} />
                US Residential Leasing
              </div>

              <h1 style={{
                marginBottom: '1.25rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em'
              }}>
                A straightforward way to find and lease your next home.
              </h1>

              <p style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}>
                OpenLeasewithus connects prospective tenants with quality single-family homes and townhomes across American neighborhoods. Browse available residences and submit your rental application online.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <Link to="/apply" className="btn btn-primary btn-lg">
                  Start Your Application
                  <ArrowRight size={16} />
                </Link>
                <Link to="/testimonials" className="btn btn-secondary btn-lg">
                  Read Testimonials
                </Link>
              </div>

              <div style={{
                marginTop: '2.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Direct Inquiries</div>
                  <a href="mailto:Openleasewithus@gmail.com" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Openleasewithus@gmail.com
                  </a>
                </div>
                <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-light)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>100% Online Review</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Frame */}
            <div>
              <div style={{
                position: 'relative',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-hover)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Quality residential home leasing"
                  style={{
                    width: '100%',
                    height: '460px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  padding: '1.25rem 1.5rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Featured Residence · Austin, TX
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      3 beds · 2 baths · Fenced Backyard
                    </div>
                  </div>
                  <Link
                    to="/testimonials"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    Read Reviews
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '3rem' }}>
            <span className="eyebrow" style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.35rem' }}>
              Step-by-Step Process
            </span>
            <h2>How It Works</h2>
            <p className="text-secondary" style={{ marginTop: '0.35rem', fontSize: '0.95rem' }}>
              A clear, transparent process designed to make renting straightforward and reliable.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 01 */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              padding: '2rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: 'var(--accent-olive)',
                marginBottom: '1rem',
                lineHeight: 1
              }}>
                01
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Find a Home
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Browse available properties across multiple US markets and find a home that fits your space, location, and budget requirements.
              </p>
            </div>

            {/* Step 02 */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              padding: '2rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: 'var(--accent-olive)',
                marginBottom: '1rem',
                lineHeight: 1
              }}>
                02
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Apply
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Complete the rental application directly through OpenLeasewithus. Provide your personal, residence, and financial information in a single secure form.
              </p>
            </div>

            {/* Step 03 */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              padding: '2rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                color: 'var(--accent-olive)',
                marginBottom: '1rem',
                lineHeight: 1
              }}>
                03
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                We'll Review It
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Our leasing team reviews your application details and contacts you directly regarding property viewings, verification, and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY OPENLEASEWITHUS SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.35rem' }}>
                Our Commitment
              </span>
              <h2 style={{ marginBottom: '1.25rem' }}>Why OpenLeasewithus</h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                We believe leasing a residential home should be clear, respectful, and free of unnecessary friction. We manage properties with care and communicate directly with applicants.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ marginTop: '0.15rem', color: 'var(--accent-olive)' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Straightforward Application Process</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      No redirects to third-party forms or hidden review portals. Everything is completed and tracked in one place.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ marginTop: '0.15rem', color: 'var(--accent-olive)' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Quality Residential Properties</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Every home is thoroughly inspected, documented with authentic photography, and ready for occupancy.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ marginTop: '0.15rem', color: 'var(--accent-olive)' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Clear Leasing Information</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Upfront monthly rents, security deposits, verified amenities, and realistic availability dates.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ marginTop: '0.15rem', color: 'var(--accent-olive)' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Direct Team Communication</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      Real leasing staff review your documents and follow up directly via email and phone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual editorial quote frame */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontStyle: 'italic',
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                marginBottom: '1.5rem'
              }}>
                "OpenLeasewithus helped us transition smoothly from an apartment into a spacious single-family home in Austin. The application was simple and we heard back from their leasing team within days."
              </div>
              <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>The Bennett Family</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leased at Oakwood Residence, Austin, TX</div>
                </div>
                <span className="badge badge-available">Verified Tenant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-inverse)',
        paddingTop: '4rem',
        paddingBottom: '4rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to find your next home?
          </h2>
          <p style={{ color: '#A6A095', fontSize: '1rem', marginBottom: '2rem' }}>
            Explore currently available residential properties or submit your rental application today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/apply" className="btn btn-primary btn-lg" style={{ backgroundColor: '#FFFFFF', color: '#191817', borderColor: '#FFFFFF' }}>
              Apply Now
            </Link>
            <Link to="/testimonials" className="btn btn-secondary btn-lg" style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
              Read Testimonials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
