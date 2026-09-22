import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

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
            Get in Touch
          </span>
          <h1 style={{ marginBottom: '1rem' }}>Contact Leasing & Support</h1>
          <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: 1.65 }}>
            Have questions regarding an active rental listing, application status, or property showings? Reach out directly to our leasing staff.
          </p>
        </div>
      </section>

      <div className="container-narrow" style={{ marginTop: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem'
        }}>
          {/* Contact Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Direct Inquiries</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ color: 'var(--accent-olive)', marginTop: '0.2rem' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="dossier-label">Official Email</div>
                    <a
                      href="mailto:Openleasewithus@gmail.com"
                      style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}
                    >
                      Openleasewithus@gmail.com
                    </a>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Monitored daily by our leasing staff
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ color: 'var(--accent-olive)', marginTop: '0.2rem' }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="dossier-label">Office Hours</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                      Monday – Friday: 9:00 AM – 6:00 PM EST
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Saturday: 10:00 AM – 3:00 PM EST (By Appointment)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ color: 'var(--accent-olive)', marginTop: '0.2rem' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="dossier-label">Residential Coverage</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Austin, Charlotte, Atlanta, Denver, Tampa, Phoenix, Nashville, Columbus
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Note */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: 1.6
            }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>Already Applied?</h4>
              <p style={{ color: 'var(--text-secondary)' }}>
                If you have already submitted your application, please include your 6-digit reference number (e.g. <code>OLW-XXXXXX</code>) in all communications for expedited review.
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '2rem'
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-approved-bg)',
                  color: 'var(--status-approved)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem'
                }}>
                  <CheckCircle2 size={28} />
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>Message Sent</h3>
                <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. A leasing representative will respond to your inquiry at <strong>{form.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Send a Message</h3>

                <div className="form-group">
                  <label className="form-label">Your Name <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Application Status">Application Status Check</option>
                    <option value="Property Showing">Request a Property Showing</option>
                    <option value="Lease Question">Leasing Terms & Policy Question</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message <span className="required">*</span></label>
                  <textarea
                    required
                    rows={4}
                    className="form-textarea"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
