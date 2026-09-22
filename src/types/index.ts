export type PropertyStatus = 'available' | 'pending' | 'leased';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  property_type: string;
  description: string;
  amenities: string[];
  images: string[];
  availability_date: string;
  status: PropertyStatus;
  created_at?: string;
}

export type ApplicationStatus = 'New' | 'Under Review' | 'Approved' | 'Rejected';

export type MaritalStatus = 'Single' | 'Married' | 'Other';

export type PaymentMethod = 'Chime' | 'Walmart' | 'Cash App' | 'Cash ATM' | 'Varo';

export interface RentalApplication {
  id: string;
  reference_number: string;
  property_id?: string;
  property_name: string;
  property_address: string;

  // 01 Personal Information
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  occupation: string;
  marital_status: MaritalStatus;
  date_of_birth: string;
  num_adults: number;

  // 02 Property & Move-in
  preferred_move_in: string;

  // 03 Current Residence
  current_address: string;
  current_address_line2?: string;
  current_city: string;
  current_state: string;
  current_zip: string;
  current_country: string;

  // 04 Co-Applicant
  has_co_applicant: boolean;
  co_first_name?: string;
  co_last_name?: string;
  co_phone?: string;

  // 05 Household & Rental History
  has_pets: boolean;
  pet_details?: string;
  monthly_income: number;
  renting_duration: string;
  has_evictions: boolean;
  has_felonies: boolean;

  // 06 Financial Information
  preferred_payment_method: PaymentMethod;
  amount_available_today: number;

  // 07 Additional Information & Agreement
  reason_for_moving?: string;
  terms_agreed: boolean;
  signature_name: string;
  signature_date: string;

  // Metadata
  status: ApplicationStatus;
  staff_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface PropertyFilterState {
  search: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  status: string;
}
