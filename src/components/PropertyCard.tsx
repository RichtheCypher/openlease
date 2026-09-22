import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, ArrowUpRight } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="property-card">
      <Link to={`/properties/${property.id}`} className="property-card-image-wrap">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'}
          alt={property.name}
          loading="lazy"
        />
        <div className="property-card-badge">
          <span className="badge badge-available">
            {property.status === 'available' ? 'Available' : property.status}
          </span>
        </div>
      </Link>

      <div className="property-card-body">
        <div className="flex-between" style={{ alignItems: 'baseline', marginBottom: '0.35rem' }}>
          <div className="property-price">
            {formattedPrice} <span>/ month</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {property.property_type}
          </span>
        </div>

        <h3 className="property-title">
          <Link to={`/properties/${property.id}`} style={{ color: 'inherit' }}>
            {property.name}
          </Link>
        </h3>

        <div className="property-location" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={13} style={{ flexShrink: 0 }} />
          <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
        </div>

        <div className="property-specs">
          <div className="property-spec-item" title="Bedrooms">
            <Bed size={15} />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div style={{ color: 'var(--border-medium)' }}>•</div>
          <div className="property-spec-item" title="Bathrooms">
            <Bath size={15} />
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div style={{ color: 'var(--border-medium)' }}>•</div>
          <div className="property-spec-item" title="Square Footage">
            <Maximize2 size={14} />
            <span>{property.square_feet.toLocaleString()} sq ft</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
          <Link
            to={`/properties/${property.id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            View Details
          </Link>
          <Link
            to={`/apply?propertyId=${property.id}`}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            Apply
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
