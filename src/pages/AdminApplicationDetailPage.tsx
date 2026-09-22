import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, User, Home, Building, Users, Clock, 
  DollarSign, FileText, CheckCircle2, Save, Printer, Mail
} from 'lucide-react';
import type { RentalApplication, ApplicationStatus } from '../types';
import { store } from '../services/store';

export const AdminApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<RentalApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ApplicationStatus>('New');
  const [staffNotes, setStaffNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const user = store.getAdminUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      store.getApplicationById(id).then((data) => {
        if (data) {
          setApplication(data);
          setStatus(data.status);
          setStaffNotes(data.staff_notes || '');
        }
        setLoading(false);
      });
    }
  }, [id, navigate]);

  const handleSave = async () => {
    if (!application) return;
    const updated = await store.updateApplicationStatus(application.id, status, staffNotes);
    if (updated) {
      setApplication(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading application profile...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Application Dossier Not Found</h2>
        <p className="text-secondary" style={{ margin: '1rem 0 2rem' }}>
          The requested application could not be located in the database.
        </p>
        <Link to="/admin" className="btn btn-primary">
          Back to Applications Dashboard
        </Link>
      </div>
    );
  }

  const createdDate = new Date(application.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '6rem' }}>
      {/* Top Bar */}
      <div style={{ backgroundColor: 'var(--bg-dark)', color: '#FFFFFF', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              color: '#D4CEBF'
            }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard Queue
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '0.35rem 0.75rem',
                borderRadius: '3px',
                fontSize: '0.775rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Printer size={13} />
              Print Dossier
            </button>
          </div>
        </div>
      </div>

      <div className="container-narrow" style={{ marginTop: '2.5rem' }}>
        {/* Header Profile Title & Status Control */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span className="eyebrow" style={{ color: 'var(--accent-olive)' }}>
                  Rental Application Dossier
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Ref: {application.reference_number}
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>
                {application.first_name} {application.last_name}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Submitted on {createdDate}
              </div>
            </div>

            {/* Staff Status Changer Card */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              minWidth: '280px'
            }}>
              <div className="dossier-label" style={{ marginBottom: '0.4rem' }}>
                Review Status & Underwriting
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <select
                  className="form-select"
                  style={{ fontWeight: 600 }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  onClick={handleSave}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Save size={14} />
                  Save
                </button>
              </div>

              {saveSuccess && (
                <div style={{ fontSize: '0.75rem', color: 'var(--status-approved)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={13} />
                  Status successfully updated
                </div>
              )}
            </div>
          </div>

          {/* Staff Underwriting Notes */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
            <label className="dossier-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
              Internal Staff Notes & Action Items
            </label>
            <textarea
              className="form-textarea"
              rows={2}
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
            />
            <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
              <button
                onClick={handleSave}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* 1. APPLICANT INFORMATION */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--accent-olive)" />
              <span>01 Personal Information</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="dossier-label">Full Name</span>
              <span className="dossier-value">{application.first_name} {application.last_name}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Email Address</span>
              <a href={`mailto:${application.email}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {application.email}
              </a>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Phone Number</span>
              <a href={`tel:${application.phone}`} style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {application.phone}
              </a>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Occupation / Employer</span>
              <span className="dossier-value">{application.occupation}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Marital Status</span>
              <span className="dossier-value">{application.marital_status}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Date of Birth</span>
              <span className="dossier-value">{application.date_of_birth}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Number of Adults</span>
              <span className="dossier-value">{application.num_adults}</span>
            </div>
          </div>
        </div>

        {/* 2. PROPERTY INFORMATION */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={16} color="var(--accent-olive)" />
              <span>02 Property Applied For</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="dossier-label">Property Name</span>
              <span className="dossier-value">{application.property_name}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Property Address</span>
              <span className="dossier-value">{application.property_address}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Preferred Move-In Date</span>
              <span className="dossier-value" style={{ fontWeight: 600, color: 'var(--accent-olive)' }}>
                {application.preferred_move_in}
              </span>
            </div>
          </div>
        </div>

        {/* 3. CURRENT RESIDENCE */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={16} color="var(--accent-olive)" />
              <span>03 Current Residence</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="dossier-label">Street Address</span>
              <span className="dossier-value">
                {application.current_address} {application.current_address_line2}
              </span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">City, State, ZIP</span>
              <span className="dossier-value">
                {application.current_city}, {application.current_state} {application.current_zip}
              </span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Country</span>
              <span className="dossier-value">{application.current_country || 'United States'}</span>
            </div>
          </div>
        </div>

        {/* 4. CO-APPLICANT */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} color="var(--accent-olive)" />
              <span>04 Co-Applicant</span>
            </div>
          </div>
          {application.has_co_applicant ? (
            <div className="dossier-grid">
              <div className="dossier-field">
                <span className="dossier-label">Co-Applicant Name</span>
                <span className="dossier-value">{application.co_first_name} {application.co_last_name}</span>
              </div>
              <div className="dossier-field">
                <span className="dossier-label">Co-Applicant Phone</span>
                <span className="dossier-value">{application.co_phone || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No co-applicant specified (Sole primary applicant).
            </div>
          )}
        </div>

        {/* 5. HOUSEHOLD & RENTAL HISTORY */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--accent-olive)" />
              <span>05 Household & Rental History</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="dossier-label">Pets</span>
              <span className="dossier-value">
                {application.has_pets ? `Yes — ${application.pet_details}` : 'No pets'}
              </span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Monthly Gross Income</span>
              <span className="dossier-value" style={{ fontWeight: 600 }}>
                ${application.monthly_income?.toLocaleString()} / mo
              </span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Renting Duration</span>
              <span className="dossier-value">{application.renting_duration}</span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Prior Evictions</span>
              <span className="dossier-value" style={{ color: application.has_evictions ? 'var(--status-rejected)' : 'inherit' }}>
                {application.has_evictions ? 'Yes (Has prior evictions)' : 'None reported'}
              </span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Felony History</span>
              <span className="dossier-value" style={{ color: application.has_felonies ? 'var(--status-rejected)' : 'inherit' }}>
                {application.has_felonies ? 'Yes (Has felony record)' : 'None reported'}
              </span>
            </div>
          </div>
        </div>

        {/* 6. FINANCIAL INFORMATION */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={16} color="var(--accent-olive)" />
              <span>06 Financial Readiness</span>
            </div>
          </div>
          <div className="dossier-grid">
            <div className="dossier-field">
              <span className="dossier-label">Preferred Payment Method</span>
              <span className="dossier-value" style={{ fontWeight: 600 }}>
                {application.preferred_payment_method}
              </span>
            </div>
            <div className="dossier-field">
              <span className="dossier-label">Amount Available Today</span>
              <span className="dossier-value" style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--accent-olive)' }}>
                ${application.amount_available_today?.toLocaleString()} USD
              </span>
            </div>
          </div>
        </div>

        {/* 7. ADDITIONAL INFORMATION & SIGNATURE */}
        <div className="dossier-section">
          <div className="dossier-section-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="var(--accent-olive)" />
              <span>07 Additional Information & Signature</span>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="dossier-label">Reason for Moving</span>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: 1.6 }}>
              {application.reason_for_moving || 'None provided.'}
            </p>
          </div>

<div className="grid-2" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <div className="dossier-field">
              <span className="dossier-label">Terms & Authorization</span>
              <span className="dossier-value">
                {application.terms_agreed ? '✓ Agreed to Terms & Conditions' : 'Not agreed'}
              </span>
            </div>

            <div className="dossier-field">
              <span className="dossier-label">Electronic Signature</span>
              <span className="dossier-value" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.15rem' }}>
                {application.signature_name}
              </span>
            </div>
          </div>

          {/* Signature Image Display */}
          {application.signature_image && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span className="dossier-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Signature Image</span>
              <img
                src={application.signature_image}
                alt="Electronic Signature"
                style={{
                  maxWidth: '300px',
                  maxHeight: '120px',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  backgroundColor: '#fff'
                }}
              />
            </div>
          )}

          {/* Supporting Documents Display */}
          {application.documents && Object.keys(application.documents).length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span className="dossier-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Supporting Documents</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {Object.entries(application.documents).map(([filename, dataUrl]) => (
                  <div
                    key={filename}
                    style={{
                      border: '1px solid var(--border-medium)',
                      borderRadius: '4px',
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-subtle)'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {filename}
                    </div>
                    {dataUrl.startsWith('data:image') ? (
                      <img
                        src={dataUrl}
                        alt={filename}
                        style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
                      <a
                        href={dataUrl}
                        download={filename}
                        style={{ color: 'var(--accent-olive)', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FileText size={13} /> Download PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
          <Link to="/admin" className="btn btn-secondary">
            &larr; Back to Dashboard Queue
          </Link>
          <a
            href={`mailto:${application.email}?subject=${encodeURIComponent(`Regarding your rental application for ${application.property_name} [Ref: ${application.reference_number}]`)}`}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Mail size={15} />
            Email Applicant Directly
          </a>
        </div>
      </div>
    </div>
  );
};
