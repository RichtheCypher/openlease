import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Bed, Bath, Maximize2, Calendar, MapPin, CheckCircle, 
  ArrowLeft, ArrowRight, ShieldCheck, Mail, Share2, Check
} from 'lucide-react';
import type { Property } from '../types';
import { store } from '../services/store';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      store.getPropertyById(id).then((data) => {
        setProperty(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <p className="text-secondary" style={{ margin: '1rem 0 2rem' }}>
          The requested rental property could not be found or has been leased.
        </p>
        <Link to="/properties" className="btn btn-primary">
          Back to Available Properties
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  const formattedDate = new Date(property.availability_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '6rem' }}>
      {/* Top Breadcrumb & Actions Bar */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/properties"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={14} />
            Back to Available Homes
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem' }}
            >
              {copiedLink ? (
                <>
                  <Check size={13} color="green" />
                  Link Copied
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  Share Property
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Title & Header Specs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '1.75rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-available">
                {property.status === 'available' ? 'Available Now' : property.status}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {property.property_type}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {property.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <MapPin size={15} />
              <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: 'var(--text-primary)', lineHeight: 1 }}>
              {formattedPrice}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Monthly Rent (USD)
            </div>
          </div>
        </div>

        {/* Photography Gallery */}
        <div style={{ marginBottom: '2.5rem' }}>
          {/* Main Hero Photo */}
          <div style={{
            position: 'relative',
            height: '480px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            marginBottom: '0.75rem'
          }}>
            <img
              src={property.images[selectedImageIndex] || property.images[0]}
              alt={`${property.name} photograph`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${property.images.length}, 1fr)`,
              gap: '0.75rem'
            }}>
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    height: '90px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid var(--text-primary)' : '1px solid var(--border-medium)',
                    opacity: selectedImageIndex === idx ? 1 : 0.7,
                    cursor: 'pointer',
                    padding: 0,
                    background: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content & Sidebar Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Details, Description, Amenities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Specs Grid */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                  <Bed size={18} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{property.bedrooms}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bedrooms</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                  <Bath size={18} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{property.bathrooms}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bathrooms</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                  <Maximize2 size={18} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{property.square_feet.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Square Feet</div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', marginBottom: '0.3rem' }}>
                  <Calendar size={18} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formattedDate}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Move-in Ready</div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem'
            }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>About This Property</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem'
            }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Features & Amenities</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.85rem'
              }}>
                {property.amenities.map((amenity, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <CheckCircle size={16} color="var(--accent-olive)" style={{ flexShrink: 0 }} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Neighborhood */}
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem'
            }}>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Neighborhood & Location</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Located at {property.address} in {property.city}, {property.state}. Convenient to local dining, transit lines, neighborhood parks, and essential retail centers.
              </p>
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    US Postal Service Registered Address
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {property.city}, {property.state} {property.zip}
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zip}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  View on Map
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Application Card & Leasing Direct Info */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '2rem',
              boxShadow: 'var(--shadow-hover)'
            }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <span className="eyebrow" style={{ color: 'var(--accent-olive)' }}>
                  Residential Leasing
                </span>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {formattedPrice} <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>/ month</span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                  <span className="text-secondary">Availability</span>
                  <strong>{formattedDate}</strong>
                </div>
                <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                  <span className="text-secondary">Security Deposit</span>
                  <strong>One Month Rent</strong>
                </div>
                <div className="flex-between">
                  <span className="text-secondary">Lease Duration</span>
                  <strong>12 Months Standard</strong>
                </div>
              </div>

              {/* Primary Apply CTA */}
              <button
                onClick={() => navigate(`/apply?propertyId=${property.id}`)}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                Apply for This Property
                <ArrowRight size={16} />
              </button>

              <div style={{
                textAlign: 'center',
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem'
              }}>
                Takes approximately 5–7 minutes to complete online.
              </div>

              <div style={{
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="var(--accent-olive)" />
                  <span>Verified Single-Property Leasing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="var(--accent-olive)" />
                  <span>Staff contact: Openleasewithus@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
