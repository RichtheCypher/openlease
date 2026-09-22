import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  propertyType: string;
  rating: number;
  date: string;
  quote: string;
  tag: string;
}

const testimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'The Bennett Family',
    location: 'Austin, TX',
    propertyType: 'Single-Family Home',
    rating: 5,
    date: 'March 2025',
    quote:
      'OpenLeasewithus helped us transition smoothly from an apartment into a spacious single-family home. The application was simple and we heard back from their leasing team within days. Everything was transparent — no hidden fees, no surprises.',
    tag: 'Verified Tenant',
  },
  {
    id: 't-2',
    name: 'Marcus & Diana Osei',
    location: 'Charlotte, NC',
    propertyType: 'Townhome',
    rating: 5,
    date: 'January 2025',
    quote:
      'We were nervous about the process since we had two young children and needed stability. The team at OpenLeasewithus answered every question we had, kept us informed at every step, and made the lease signing completely stress-free.',
    tag: 'Verified Tenant',
  },
  {
    id: 't-3',
    name: 'Priya Nair',
    location: 'Nashville, TN',
    propertyType: 'Single-Family Home',
    rating: 5,
    date: 'November 2024',
    quote:
      'I relocated for work and needed a home fast. The online application was incredibly easy — I submitted everything from my phone. Within 48 hours I had a response. I genuinely appreciated how direct and professional the communication was throughout.',
    tag: 'Relocation Tenant',
  },
  {
    id: 't-4',
    name: 'James & Cora Henderson',
    location: 'Dallas, TX',
    propertyType: 'Single-Family Home',
    rating: 5,
    date: 'October 2024',
    quote:
      'After years of renting through larger companies with poor communication, OpenLeasewithus felt like a breath of fresh air. Real people, real answers. The property was exactly as described and in excellent condition when we moved in.',
    tag: 'Repeat Tenant',
  },
  {
    id: 't-5',
    name: 'Sofia Reyes',
    location: 'Phoenix, AZ',
    propertyType: 'Townhome',
    rating: 5,
    date: 'August 2024',
    quote:
      "The entire process from inquiry to move-in took under two weeks. I've never had a rental experience this organized. The lease terms were upfront, the property photos were accurate, and the neighborhood was exactly what I was looking for.",
    tag: 'Verified Tenant',
  },
  {
    id: 't-6',
    name: 'David & Yvonne Chibuike',
    location: 'Atlanta, GA',
    propertyType: 'Single-Family Home',
    rating: 5,
    date: 'June 2024',
    quote:
      'We were first-time renters and had many questions. The team was patient and walked us through every part of the lease. The home itself is beautiful — large kitchen, backyard for our dog — exactly what we needed.',
    tag: 'First-Time Renter',
  },
  {
    id: 't-7',
    name: 'Ting & Li Zhang',
    location: 'Houston, TX',
    propertyType: 'Single-Family Home',
    rating: 5,
    date: 'April 2024',
    quote:
      'OpenLeasewithus respected our time and our budget. We asked a lot of questions and never felt dismissed. The leasing rep was knowledgeable and honest about every property detail. We renewed our lease without hesitation.',
    tag: 'Renewed Lease',
  },
  {
    id: 't-8',
    name: 'Alicia Monroe',
    location: 'Raleigh, NC',
    propertyType: 'Townhome',
    rating: 5,
    date: 'February 2024',
    quote:
      "As a single professional, I needed a safe, well-maintained home close to downtown. OpenLeasewithus delivered exactly that. The application portal was simple, the move-in checklist was thorough, and I've had zero maintenance headaches.",
    tag: 'Verified Tenant',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? 'var(--accent-olive)' : 'none'}
          color={i < rating ? 'var(--accent-olive)' : 'var(--border-medium)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'var(--border-medium)' : 'var(--border-light)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'none',
      }}
    >
      <div style={{ color: 'var(--accent-olive)', opacity: 0.6 }}>
        <Quote size={24} strokeWidth={1.5} />
      </div>

      <p
        style={{
          fontSize: '0.9375rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          fontStyle: 'italic',
          flexGrow: 1,
        }}
      >
        "{testimonial.quote}"
      </p>

      <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <StarRating rating={testimonial.rating} />
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {testimonial.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            {testimonial.propertyType} · {testimonial.location}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            {testimonial.date}
          </div>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--accent-olive)',
            backgroundColor: 'var(--accent-olive-light)',
            padding: '0.3rem 0.55rem',
            borderRadius: '2px',
          }}
        >
          <CheckCircle2 size={11} />
          {testimonial.tag}
        </span>
      </div>
    </div>
  );
}

export const TestimonialsPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* PAGE HERO */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '4rem',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-main)',
        }}
      >
        <div className="container" style={{ maxWidth: '760px' }}>
          <span
            className="eyebrow"
            style={{ color: 'var(--accent-olive)', display: 'block', marginBottom: '0.5rem' }}
          >
            Tenant Experiences
          </span>
          <h1 style={{ letterSpacing: '-0.025em', marginBottom: '1rem' }}>
            What Our Residents Say
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '620px',
            }}
          >
            Real stories from families, professionals, and individuals who have leased through OpenLeasewithus. Honest, direct, and verified.
          </p>
        </div>
      </section>

      {/* STATS STRIP */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
          padding: '2.5rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            {[
              { value: '5.0', label: 'Average Rating', sub: 'Across all tenants' },
              { value: '100%', label: 'Would Recommend', sub: 'To friends & family' },
              { value: '48 hrs', label: 'Avg. Response Time', sub: 'After application' },
              { value: '2 Weeks', label: 'Avg. Move-In Timeline', sub: 'From inquiry to keys' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    marginBottom: '0.35rem',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS GRID */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PULL QUOTE */}
      <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
          padding: '5rem 0',
        }}
      >
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Quote size={36} color="var(--accent-olive)" strokeWidth={1.2} />
          </div>
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontStyle: 'italic',
              lineHeight: 1.55,
              color: 'var(--text-primary)',
              marginBottom: '2rem',
            }}
          >
            "We renewed our lease without hesitation. Real people, clear communication, and a home we're proud to live in."
          </blockquote>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Ting & Li Zhang
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Leased in Houston, TX · Renewed 2025
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
            <StarRating rating={5} />
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--text-inverse)',
          paddingTop: '4rem',
          paddingBottom: '4rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Ready to start your own story?
          </h2>
          <p style={{ color: '#A6A095', fontSize: '1rem', marginBottom: '2rem' }}>
            Submit a rental application today and our leasing team will follow up with you directly.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/apply"
              className="btn btn-primary btn-lg"
              style={{ backgroundColor: '#FFFFFF', color: '#191817', borderColor: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              Apply Now
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary btn-lg"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
