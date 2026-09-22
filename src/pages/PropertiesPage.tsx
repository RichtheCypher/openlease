import React, { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { Property, PropertyFilterState } from '../types';
import { store } from '../services/store';
import { PropertyCard } from '../components/PropertyCard';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<PropertyFilterState>({
    search: '',
    city: 'all',
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: 'all',
    bathrooms: 'all',
    propertyType: 'all',
    status: 'all'
  });

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft-desc'>('featured');

  useEffect(() => {
    store.getProperties().then((data) => {
      setProperties(data);
      setLoading(false);
    });
  }, []);

  // Unique cities list
  const cities = useMemo(() => {
    const list = properties.map((p) => `${p.city}, ${p.state}`);
    return Array.from(new Set(list));
  }, [properties]);

  // Unique property types
  const propertyTypes = useMemo(() => {
    const list = properties.map((p) => p.property_type);
    return Array.from(new Set(list));
  }, [properties]);

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Search keyword
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesAddress = p.address.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesState = p.state.toLowerCase().includes(q);
        const matchesZip = p.zip.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesAddress && !matchesCity && !matchesState && !matchesZip && !matchesDesc) {
          return false;
        }
      }

      // City filter
      if (filters.city !== 'all') {
        const cityState = `${p.city}, ${p.state}`;
        if (cityState !== filters.city) return false;
      }

      // Price filter
      if (p.price > filters.maxPrice) return false;

      // Bedrooms filter
      if (filters.bedrooms !== 'all') {
        const minBeds = parseInt(filters.bedrooms, 10);
        if (p.bedrooms < minBeds) return false;
      }

      // Bathrooms filter
      if (filters.bathrooms !== 'all') {
        const minBaths = parseFloat(filters.bathrooms);
        if (p.bathrooms < minBaths) return false;
      }

      // Property type filter
      if (filters.propertyType !== 'all') {
        if (p.property_type !== filters.propertyType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sqft-desc') return b.square_feet - a.square_feet;
      return 0; // featured default
    });
  }, [properties, filters, sortBy]);

  const resetFilters = () => {
    setFilters({
      search: '',
      city: 'all',
      minPrice: 0,
      maxPrice: 5000,
      bedrooms: 'all',
      bathrooms: 'all',
      propertyType: 'all',
      status: 'all'
    });
    setSortBy('featured');
  };

  const hasActiveFilters = filters.search || filters.city !== 'all' || filters.bedrooms !== 'all' || filters.bathrooms !== 'all' || filters.propertyType !== 'all' || filters.maxPrice < 5000;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '5rem' }}>
      {/* Page Header */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        paddingTop: '3rem',
        paddingBottom: '2.5rem'
      }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.35rem' }}>
            Property Catalog
          </span>
          <h1 style={{ marginBottom: '0.75rem' }}>Available Rental Homes</h1>
          <p className="text-secondary" style={{ maxWidth: '640px', fontSize: '1rem' }}>
            Browse currently available residential properties. Each listing is verified, fully documented, and ready for rental applications.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-subtle)',
          marginBottom: '2rem'
        }}>
          {/* Main search and filters row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            {/* Search */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Search size={13} />
                Search Location, Address or Keywords
              </label>
              <input
                type="text"
                className="form-control"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* City */}
            <div>
              <label className="form-label">City / Market</label>
              <select
                className="form-select"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              >
                <option value="all">All Markets ({cities.length})</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="form-label">Bedrooms</label>
              <select
                className="form-select"
                value={filters.bedrooms}
                onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1+ Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="form-label">Bathrooms</label>
              <select
                className="form-select"
                value={filters.bathrooms}
                onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
              >
                <option value="all">Any Bathrooms</option>
                <option value="1">1+ Baths</option>
                <option value="1.5">1.5+ Baths</option>
                <option value="2">2+ Baths</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="form-label">Property Type</label>
              <select
                className="form-select"
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              >
                <option value="all">All Property Types</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary filter & sort bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Max budget filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Max Monthly Rent:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', minWidth: '70px' }}>
                  ${filters.maxPrice.toLocaleString()}/mo
                </span>
                <input
                  type="range"
                  min="1500"
                  max="5000"
                  step="100"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value, 10) })}
                  style={{ width: '130px', accentColor: 'var(--text-primary)' }}
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-terracotta)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.8125rem',
                    fontWeight: 500
                  }}
                >
                  <RotateCcw size={13} />
                  Reset Filters
                </button>
              )}
            </div>

            {/* Sorting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8125rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="featured">Featured Order</option>
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="sqft-desc">Square Footage: Largest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredProperties.length}</strong> available {filteredProperties.length === 1 ? 'residence' : 'residences'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}>
            <SlidersHorizontal size={13} />
            <span>Updated Daily</span>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            padding: '4rem 2rem',
            textAlign: 'center',
            maxWidth: '540px',
            margin: '2rem auto'
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No matching properties found</h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We couldn't find any homes matching your current filter settings. Try expanding your search criteria or resetting filters.
            </p>
            <button onClick={resetFilters} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
