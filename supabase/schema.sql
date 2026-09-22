-- OpenLeasewithus Database Schema for Supabase
-- Residential Leasing Platform with Integrated Rental Application System

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROPERTIES TABLE
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  country text not null default 'United States',
  price numeric(10, 2) not null,
  bedrooms integer not null,
  bathrooms numeric(3, 1) not null,
  square_feet integer not null,
  property_type text not null default 'Single Family',
  description text not null,
  amenities text[] default '{}',
  images text[] default '{}',
  availability_date date not null,
  status text not null default 'available' check (status in ('available', 'pending', 'leased')),
  created_at timestamp with time zone default now()
);

-- 2. APPLICATIONS TABLE
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique not null,
  property_id uuid references public.properties(id) on delete set null,
  property_name text not null,
  property_address text not null,
  
  -- Personal Information
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  occupation text not null,
  marital_status text not null check (marital_status in ('Single', 'Married', 'Other')),
  date_of_birth date not null,
  num_adults integer not null default 1,
  
  -- Move-in Information
  preferred_move_in date not null,
  
  -- Current Residence
  current_address text not null,
  current_address_line2 text,
  current_city text not null,
  current_state text not null,
  current_zip text not null,
  current_country text not null default 'United States',
  
  -- Co-Applicant
  has_co_applicant boolean not null default false,
  co_first_name text,
  co_last_name text,
  co_phone text,
  
  -- Household & Rental History
  has_pets boolean not null default false,
  pet_details text,
  monthly_income numeric(10, 2) not null,
  renting_duration text not null,
  has_evictions boolean not null default false,
  has_felonies boolean not null default false,
  
  -- Financial Information
  preferred_payment_method text not null check (preferred_payment_method in ('Chime', 'Walmart', 'Cash App', 'Cash ATM', 'Varo')),
  amount_available_today numeric(10, 2) not null,
  
  -- Additional Information & Signature
  reason_for_moving text,
  terms_agreed boolean not null default true,
  signature_name text not null,
  signature_image text,
  signature_date timestamp with time zone default now(),

  -- Supporting Documents (base64 encoded)
  documents jsonb default '{}'::jsonb,

  -- Application Status
  status text not null default 'New' check (status in ('New', 'Under Review', 'Approved', 'Rejected')),
  staff_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.applications enable row level security;

-- Policies for Properties: Public read access for available listings
create policy "Allow public read access to properties" 
  on public.properties 
  for select 
  using (true);

-- Policies for Applications:
-- 1. Allow public anonymous users to insert new applications
create policy "Allow public application submission" 
  on public.applications 
  for insert 
  with check (true);

-- 2. Allow authenticated staff/admins to select, update, and delete applications
create policy "Allow staff full access to applications" 
  on public.applications 
  for all 
  to authenticated 
  using (true)
  with check (true);

-- Indexes for performance
create index if not exists idx_properties_city on public.properties(city);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_ref on public.applications(reference_number);
create index if not exists idx_applications_created on public.applications(created_at desc);
