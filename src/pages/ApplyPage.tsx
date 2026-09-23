import React, { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Check, ArrowRight, ArrowLeft, CheckCircle2,
  Home, User, Building, Users, Clock, DollarSign, FileText,
  PenLine, Upload, Trash2, FileText as FileIcon, Image as ImageIcon
} from 'lucide-react';
import type { MaritalStatus, PaymentMethod } from '../types';
import { store } from '../services/store';

const STEP_LABELS = [
  { id: 1, name: 'Personal', icon: User },
  { id: 2, name: 'Property', icon: Home },
  { id: 3, name: 'Residence', icon: Building },
  { id: 4, name: 'Co-Applicant', icon: Users },
  { id: 5, name: 'Rental History', icon: Clock },
  { id: 6, name: 'Financial', icon: DollarSign },
  { id: 7, name: 'Review & Sign', icon: FileText }
];

export const ApplyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const propertyIdParam = searchParams.get('propertyId');

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Signature pad state
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Canvas drawing helpers
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPos.current) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#191817';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
    setHasSignature(true);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedSignature(ev.target?.result as string);
      setHasSignature(true);
    };
    reader.readAsDataURL(file);
  };

  const signatureProvided = () => {
    if (signatureMode === 'upload') return !!uploadedSignature;
    return hasSignature;
  };

  // Form State
  const [formData, setFormData] = useState({
    // 01 Personal
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    occupation: '',
    marital_status: 'Single' as MaritalStatus,
    date_of_birth: '',
    num_adults: 1,

    // 02 Property
    property_id: propertyIdParam || '',
    property_name: '',
    property_address: '',
    preferred_move_in: '',

    // 03 Current Residence
    current_address: '',
    current_address_line2: '',
    current_city: '',
    current_state: '',
    current_zip: '',
    current_country: 'United States',

    // 04 Co-Applicant
    has_no_co_applicant: true,
    co_first_name: '',
    co_last_name: '',
    co_phone: '',

    // 05 Household & Rental History
    has_pets: false,
    pet_details: '',
    monthly_income: '' as any,
    renting_duration: '',
    has_evictions: false,
    has_felonies: false,

    // 06 Financial
    preferred_payment_method: 'Chime' as PaymentMethod,
    amount_available_today: '' as any,

    // 07 Additional & Agreement
    reason_for_moving: '',
    terms_agreed: false,
    signature_name: '',
    signature_image: null as string | null,
    documents: [] as File[],
  });


  // Validation per step
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.first_name.trim()) errs.first_name = 'First name is required';
      if (!formData.last_name.trim()) errs.last_name = 'Last name is required';
      if (!formData.phone.trim()) errs.phone = 'Phone number is required';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email address is required';
      if (!formData.occupation.trim()) errs.occupation = 'Occupation is required';
      if (!formData.date_of_birth) errs.date_of_birth = 'Date of birth is required';
    }

    if (step === 2) {
      if (!formData.property_name.trim()) errs.property_name = 'Please enter the property name or address you are applying for';
      if (!formData.preferred_move_in) errs.preferred_move_in = 'Preferred move-in date is required';
    }

    if (step === 3) {
      if (!formData.current_address.trim()) errs.current_address = 'Current street address is required';
      if (!formData.current_city.trim()) errs.current_city = 'City is required';
      if (!formData.current_state.trim()) errs.current_state = 'State is required';
      if (!formData.current_zip.trim()) errs.current_zip = 'ZIP code is required';
    }

    if (step === 4) {
      if (!formData.has_no_co_applicant) {
        if (!formData.co_first_name.trim()) errs.co_first_name = 'Co-applicant first name is required';
        if (!formData.co_last_name.trim()) errs.co_last_name = 'Co-applicant last name is required';
      }
    }

    if (step === 5) {
      if (!formData.monthly_income || Number(formData.monthly_income) <= 0) {
        errs.monthly_income = 'Please specify your approximate monthly income before taxes';
      }
      if (!formData.renting_duration.trim()) {
        errs.renting_duration = 'Please specify how long you have been renting';
      }
      if (formData.has_pets && !formData.pet_details.trim()) {
        errs.pet_details = 'Please briefly describe your pet (breed, age, weight)';
      }
    }

    if (step === 6) {
      if (!formData.amount_available_today || Number(formData.amount_available_today) <= 0) {
        errs.amount_available_today = 'Please enter the amount available to secure the property';
      }
    }

    if (step === 7) {
      if (!formData.terms_agreed) {
        errs.terms_agreed = 'You must review and agree to the terms & conditions';
      }
      if (!formData.signature_name.trim()) {
        errs.signature_name = 'Please enter your full legal name as it appears on your ID';
      }
      if (!signatureProvided()) {
        errs.signature_pad = 'Please provide your signature to continue';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(7)) return;

    setSubmitting(true);
    try {
      // Process documents into base64 strings
      const documents: Record<string, string> = {};
      for (const file of formData.documents) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
        documents[file.name] = base64;
      }

      const app = await store.submitApplication({
        property_id: formData.property_id || undefined,
        property_name: formData.property_name || 'General Inquiry',
        property_address: formData.property_address || `${formData.current_city}, ${formData.current_state}`,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        email: formData.email,
        occupation: formData.occupation,
        marital_status: formData.marital_status,
        date_of_birth: formData.date_of_birth,
        num_adults: Number(formData.num_adults) || 1,
        preferred_move_in: formData.preferred_move_in,
        current_address: formData.current_address,
        current_address_line2: formData.current_address_line2 || undefined,
        current_city: formData.current_city,
        current_state: formData.current_state,
        current_zip: formData.current_zip,
        current_country: formData.current_country,
        has_co_applicant: !formData.has_no_co_applicant,
        co_first_name: !formData.has_no_co_applicant ? formData.co_first_name : undefined,
        co_last_name: !formData.has_no_co_applicant ? formData.co_last_name : undefined,
        co_phone: !formData.has_no_co_applicant ? formData.co_phone : undefined,
        has_pets: formData.has_pets,
        pet_details: formData.has_pets ? formData.pet_details : undefined,
        monthly_income: Number(formData.monthly_income),
        renting_duration: formData.renting_duration,
        has_evictions: formData.has_evictions,
        has_felonies: formData.has_felonies,
        preferred_payment_method: formData.preferred_payment_method,
        amount_available_today: Number(formData.amount_available_today),
        reason_for_moving: formData.reason_for_moving || undefined,
        terms_agreed: formData.terms_agreed,
        signature_name: formData.signature_name,
        signature_image: signatureMode === 'draw'
          ? (hasSignature && canvasRef.current ? canvasRef.current.toDataURL('image/png') : null)
          : (uploadedSignature || null),
        documents,
        signature_date: new Date().toISOString(),
      });

      setSubmittedRef(app.reference_number);
    } catch (err: any) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedRef) {
    return (
      <div className="success-screen-wrapper">
        <div className="container-narrow">
          <div className="success-card">
            <div className="success-icon-badge">
              <CheckCircle2 size={36} />
            </div>

            <span className="eyebrow" style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.35rem' }}>
              Submission Received
            </span>
            <h1 className="success-title">Application Submitted</h1>

            <div className="success-ref-box">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Application Reference Number
              </div>
              <div className="success-ref-code">
                {submittedRef}
              </div>
            </div>

            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '520px',
              margin: '0 auto 0.75rem'
            }}>
              Thank you, <strong>{formData.first_name}</strong>. Your rental application has been received and our leasing team has been notified.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              We will review your information and contact you at <strong>{formData.email}</strong> regarding next steps.
            </p>

            {/* Application Fee Notice */}
            <div className="success-fee-notice">
              <div className="success-fee-icon">
                <Check size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-olive)', marginBottom: '0.25rem' }}>
                  Next Step: Submit Application Fee
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Please reach out directly to the Landlord to submit your refundable application fee via your selected payment method (<strong>{formData.preferred_payment_method}</strong>) to finalize the review process.
                </p>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/" className="btn btn-primary" style={{ minWidth: '160px', textAlign: 'center' }}>
                Return Home
              </Link>
              <Link to="/testimonials" className="btn btn-secondary" style={{ minWidth: '160px', textAlign: 'center' }}>
                Read Testimonials
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '6rem' }}>
      {/* Top Header */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        paddingTop: '2.5rem',
        paddingBottom: '2rem'
      }}>
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.35rem' }}>
            Residential Lease Application
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '0.5rem' }}>
            Rental Application
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>
            Please complete all sections accurately. Your information is kept strictly confidential and reviewed directly by our leasing team.
          </p>
        </div>
      </section>

      <div className="container-narrow" style={{ marginTop: '2rem' }}>
        {/* Stepper Progress Bar */}
        <div className="stepper-container">
          {STEP_LABELS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-number">
                    {isCompleted ? <Check size={13} strokeWidth={3} /> : step.id}
                  </div>
                  <span>{step.name}</span>
                </div>
                {step.id < STEP_LABELS.length && <div className="step-divider" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Multi-step Form Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>01 Personal Information</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                Primary applicant details for background and identity verification.
              </p>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                  {errors.first_name && <div className="form-error">{errors.first_name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                  {errors.last_name && <div className="form-error">{errors.last_name}</div>}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Occupation / Employer <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                  {errors.occupation && <div className="form-error">{errors.occupation}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    className="form-select"
                    value={formData.marital_status}
                    onChange={(e) => setFormData({ ...formData, marital_status: e.target.value as MaritalStatus })}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth <span className="required">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                  {errors.date_of_birth && <div className="form-error">{errors.date_of_birth}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Adults in Household <span className="required">*</span></label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-control"
                    value={formData.num_adults}
                    onChange={(e) => setFormData({ ...formData, num_adults: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROPERTY INFORMATION */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>02 Property Information</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                Enter the address or name of the home you are applying for, along with your target move-in date.
              </p>

              <div className="form-group">
                <label className="form-label">Property Name / Description <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 3-bed single-family home in Austin, TX"
                  value={formData.property_name}
                  onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                />
                {errors.property_name && <div className="form-error">{errors.property_name}</div>}
                <div className="form-hint">Enter the name, address, or brief description of the property you are interested in.</div>
              </div>

              <div className="form-group">
                <label className="form-label">Property Address (if known)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1234 Maple St, Austin, TX 78701"
                  value={formData.property_address}
                  onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    value="United States"
                    disabled
                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Move-In Date <span className="required">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.preferred_move_in}
                    onChange={(e) => setFormData({ ...formData, preferred_move_in: e.target.value })}
                  />
                  {errors.preferred_move_in && <div className="form-error">{errors.preferred_move_in}</div>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CURRENT RESIDENCE */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>03 Current Residence</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                Where are you currently living?
              </p>

              <div className="form-group">
                <label className="form-label">Street Address <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.current_address}
                  onChange={(e) => setFormData({ ...formData, current_address: e.target.value })}
                />
                {errors.current_address && <div className="form-error">{errors.current_address}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Address Line 2 (Apt, Suite, Unit)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.current_address_line2}
                  onChange={(e) => setFormData({ ...formData, current_address_line2: e.target.value })}
                />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">City <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.current_city}
                    onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
                  />
                  {errors.current_city && <div className="form-error">{errors.current_city}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">State <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength={2}
                    value={formData.current_state}
                    onChange={(e) => setFormData({ ...formData, current_state: e.target.value.toUpperCase() })}
                  />
                  {errors.current_state && <div className="form-error">{errors.current_state}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">ZIP Code <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    maxLength={10}
                    value={formData.current_zip}
                    onChange={(e) => setFormData({ ...formData, current_zip: e.target.value })}
                  />
                  {errors.current_zip && <div className="form-error">{errors.current_zip}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value="United States"
                  disabled
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                />
              </div>
            </div>
          )}

          {/* STEP 4: CO-APPLICANT */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>04 Co-Applicant Information</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                If another adult will be co-signing or co-leasing this residence with you.
              </p>

              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-light)'
              }}>
                <label className="custom-checkbox" style={{ fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={formData.has_no_co_applicant}
                    onChange={(e) => setFormData({ ...formData, has_no_co_applicant: e.target.checked })}
                  />
                  <span>I do not have a co-applicant for this application</span>
                </label>
              </div>

              {!formData.has_no_co_applicant && (
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Co-Applicant First Name <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.co_first_name}
                        onChange={(e) => setFormData({ ...formData, co_first_name: e.target.value })}
                      />
                      {errors.co_first_name && <div className="form-error">{errors.co_first_name}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Co-Applicant Last Name <span className="required">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.co_last_name}
                        onChange={(e) => setFormData({ ...formData, co_last_name: e.target.value })}
                      />
                      {errors.co_last_name && <div className="form-error">{errors.co_last_name}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Co-Applicant Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.co_phone}
                      onChange={(e) => setFormData({ ...formData, co_phone: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: HOUSEHOLD & RENTAL HISTORY */}
          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>05 Household & Rental History</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                Standard verification details required by our residential leasing underwriting.
              </p>

              {/* Pets */}
              <div className="form-group">
                <label className="form-label">Do you have pets? <span className="required">*</span></label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <label className="custom-checkbox">
                    <input
                      type="radio"
                      name="pets"
                      checked={formData.has_pets === true}
                      onChange={() => setFormData({ ...formData, has_pets: true })}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="custom-checkbox">
                    <input
                      type="radio"
                      name="pets"
                      checked={formData.has_pets === false}
                      onChange={() => setFormData({ ...formData, has_pets: false, pet_details: '' })}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.has_pets && (
                <div className="form-group" style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                  <label className="form-label">Pet Details (Breed, weight, age) <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.pet_details}
                    onChange={(e) => setFormData({ ...formData, pet_details: e.target.value })}
                  />
                  {errors.pet_details && <div className="form-error">{errors.pet_details}</div>}
                </div>
              )}

              {/* Income */}
              <div className="form-group">
                <label className="form-label">Household Monthly Income Before Taxes (USD) <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    className="form-control"
                    style={{ paddingLeft: '1.75rem' }}
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                  />
                </div>
                {errors.monthly_income && <div className="form-error">{errors.monthly_income}</div>}
                <div className="form-hint">Combined pre-tax gross monthly earnings for all adults.</div>
              </div>

              {/* Renting Duration */}
              <div className="form-group">
                <label className="form-label">How long have you been renting? <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.renting_duration}
                  onChange={(e) => setFormData({ ...formData, renting_duration: e.target.value })}
                />
                {errors.renting_duration && <div className="form-error">{errors.renting_duration}</div>}
              </div>

              {/* Eviction */}
              <div className="form-group" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                <label className="form-label">Have you ever been evicted? <span className="required">*</span></label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <label className="custom-checkbox">
                    <input
                      type="radio"
                      name="evictions"
                      checked={formData.has_evictions === true}
                      onChange={() => setFormData({ ...formData, has_evictions: true })}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="custom-checkbox">
                    <input
                      type="radio"
                      name="evictions"
                      checked={formData.has_evictions === false}
                      onChange={() => setFormData({ ...formData, has_evictions: false })}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Felonies */}
              <div className="form-group">
                <label className="form-label">Have you ever been convicted of a felony? <span className="required">*</span></label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                  <label className="custom-checkbox">
                    <input
                      type="radio"
                      name="felonies"
                      checked={formData.has_felonies === true}
                      onChange={() => setFormData({ ...formData, has_felonies: true })}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="custom-checkbox">
                    <input
                      type="radio"
                      name="felonies"
                      checked={formData.has_felonies === false}
                      onChange={() => setFormData({ ...formData, has_felonies: false })}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: FINANCIAL INFORMATION */}
          {currentStep === 6 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>06 Financial Information</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                How would you like to pay for the refundable application fee?
              </p>

              <div className="form-group">
                <label className="form-label">Preferred Payment Method <span className="required">*</span></label>
                <div className="radio-card-group" style={{ marginTop: '0.5rem' }}>
                  {(['Chime', 'Walmart', 'Cash App', 'Cash ATM', 'Varo'] as PaymentMethod[]).map((method) => {
                    const isSelected = formData.preferred_payment_method === method;
                    return (
                      <div
                        key={method}
                        className={`radio-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, preferred_payment_method: method })}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{method}</div>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Verified US Method</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '2rem' }}>
                <label className="form-label">How much do you have to secure the property for yourself today? <span className="required">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    className="form-control"
                    style={{ paddingLeft: '1.75rem' }}
                    value={formData.amount_available_today}
                    onChange={(e) => setFormData({ ...formData, amount_available_today: e.target.value })}
                  />
                </div>
                {errors.amount_available_today && <div className="form-error">{errors.amount_available_today}</div>}
                <div className="form-hint">
                  Include security deposit and initial month move-in readiness.
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW & SIGN */}
          {currentStep === 7 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>07 Review & Legal Signature</h2>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                Please review your application summary and electronically sign below.
              </p>

              {/* Summary Dossier Review */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div className="flex-between" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Application Summary</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click 'Back' to adjust any section</span>
                </div>

                <div className="grid-2" style={{ gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Applicant</span>
                    <strong>{formData.first_name} {formData.last_name}</strong>
                    <div style={{ color: 'var(--text-secondary)' }}>{formData.email} · {formData.phone}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Occupation: {formData.occupation}</div>
                  </div>

                  <div>
                    <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Property Applied For</span>
                    <strong>{formData.property_name || 'General Application'}</strong>
                    <div style={{ color: 'var(--text-secondary)' }}>{formData.property_address || 'US Residential Market'}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Move-in: {formData.preferred_move_in}</div>
                  </div>

                  <div>
                    <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Current Residence</span>
                    <div>{formData.current_address} {formData.current_address_line2}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{formData.current_city}, {formData.current_state} {formData.current_zip}</div>
                  </div>

                  <div>
                    <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', display: 'block' }}>Financial & History</span>
                    <div>Pre-tax Income: <strong>${Number(formData.monthly_income).toLocaleString()}/mo</strong></div>
                    <div>Funds Today: <strong>${Number(formData.amount_available_today).toLocaleString()}</strong> via {formData.preferred_payment_method}</div>
                    <div>Pets: {formData.has_pets ? formData.pet_details || 'Yes' : 'None'}</div>
                  </div>
                </div>
              </div>

              {/* Reason for Moving */}
              <div className="form-group">
                <label className="form-label">Reason for Moving</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.reason_for_moving}
                  onChange={(e) => setFormData({ ...formData, reason_for_moving: e.target.value })}
                />
              </div>

              {/* Supporting Documents Upload */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label">Supporting Documents (Optional)</label>
                <div style={{
                  border: '1.5px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#fff',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}>
                  <FileIcon size={28} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>
                    Upload any supporting documents (ID, pay stubs, proof of income, references, etc.)
                  </p>
                  <label
                    htmlFor="doc-upload"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.8125rem',
                      fontWeight: 600
                    }}
                  >
                    <Upload size={14} />
                    Select Files
                  </label>
                  <input
                    id="doc-upload"
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files) {
                        setFormData({ ...formData, documents: [...formData.documents, ...Array.from(e.target.files)] });
                        e.target.value = '';
                      }
                    }}
                  />
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '0.75rem 0 0' }}>
                    Supported: images (PNG, JPG) and PDF. Files are stored securely with your application.
                  </p>
                </div>

                {formData.documents.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: 'var(--bg-subtle)',
                          border: '1px solid var(--border-light)',
                          borderRadius: '4px',
                          fontSize: '0.775rem'
                        }}
                      >
                        <ImageIcon size={14} color="var(--accent-olive)" />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, documents: formData.documents.filter((_, i) => i !== index) })}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-rejected)', padding: '0.1rem' }}
                          title="Remove file"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms & Conditions Notice */}
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                margin: '1.5rem 0',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Terms & Authorization Statement
                </h4>
                I declare that all statements made on this rental application are true and complete. I authorize OpenLeasewithus and its representatives to conduct background verification, employment verification, and rental history references. I understand that false or misleading information shall constitute grounds for rejection of this application or termination of lease.
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.terms_agreed}
                    onChange={(e) => setFormData({ ...formData, terms_agreed: e.target.checked })}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    I agree to the terms and conditions stated above <span className="required">*</span>
                  </span>
                </label>
                {errors.terms_agreed && <div className="form-error">{errors.terms_agreed}</div>}
              </div>

              {/* Signature Section */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.35rem', display: 'block' }}>
                  Full Legal Name (as it appears on your ID) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. John Michael Doe"
                  value={formData.signature_name}
                  onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
                />
                {errors.signature_name && <div className="form-error">{errors.signature_name}</div>}
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>Draw or Upload Signature <span className="required">*</span></span>
                  {/* Mode toggle */}
                  <div style={{ display: 'flex', gap: '0', border: '1px solid var(--border-medium)', borderRadius: '4px', overflow: 'hidden', fontSize: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => { setSignatureMode('draw'); setUploadedSignature(null); setHasSignature(false); clearCanvas(); }}
                      style={{
                        padding: '0.3rem 0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        backgroundColor: signatureMode === 'draw' ? 'var(--text-primary)' : 'var(--bg-surface)',
                        color: signatureMode === 'draw' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                        fontWeight: signatureMode === 'draw' ? 600 : 400,
                        transition: 'all 0.15s'
                      }}
                    >
                      <PenLine size={12} /> Draw
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSignatureMode('upload'); clearCanvas(); setHasSignature(false); }}
                      style={{
                        padding: '0.3rem 0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                        backgroundColor: signatureMode === 'upload' ? 'var(--text-primary)' : 'var(--bg-surface)',
                        color: signatureMode === 'upload' ? 'var(--text-inverse)' : 'var(--text-secondary)',
                        fontWeight: signatureMode === 'upload' ? 600 : 400,
                        transition: 'all 0.15s'
                      }}
                    >
                      <Upload size={12} /> Upload
                    </button>
                  </div>
                </label>

                {/* Draw Mode */}
                {signatureMode === 'draw' && (
                  <div>
                    <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${errors.signature_name ? 'var(--status-rejected)' : 'var(--border-medium)'}`, overflow: 'hidden', backgroundColor: '#fff', touchAction: 'none' }}>
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={180}
                        style={{ display: 'block', width: '100%', height: '180px', cursor: 'crosshair' }}
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={stopDraw}
                      />
                      {!hasSignature && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sign here using your mouse or finger</span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      >
                        <Trash2 size={13} /> Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Mode */}
                {signatureMode === 'upload' && (
                  <div>
                    <label
                      htmlFor="sig-upload"
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        border: `1.5px dashed ${errors.signature_name ? 'var(--status-rejected)' : 'var(--border-medium)'}`,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#fff',
                        height: '180px',
                        cursor: 'pointer',
                        gap: '0.5rem'
                      }}
                    >
                      {uploadedSignature ? (
                        <img src={uploadedSignature} alt="Uploaded signature" style={{ maxHeight: '140px', maxWidth: '90%', objectFit: 'contain' }} />
                      ) : (
                        <>
                          <Upload size={24} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to upload signature image (PNG, JPG)</span>
                        </>
                      )}
                    </label>
                    <input
                      id="sig-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleSignatureUpload}
                    />
                    {uploadedSignature && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => { setUploadedSignature(null); setHasSignature(false); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {errors.signature_pad && <div className="form-error" style={{ marginTop: '0.4rem' }}>{errors.signature_pad}</div>}
                <div className="form-hint">
                  Your signature constitutes a legally binding electronic signature under the US E-SIGN Act.
                </div>
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)'
          }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-secondary"
                disabled={submitting}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{
                  backgroundColor: 'var(--accent-olive)',
                  borderColor: 'var(--accent-olive)',
                  opacity: submitting ? 0.75 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s'
                }}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
                <Check size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


