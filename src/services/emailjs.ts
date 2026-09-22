/**
 * emailjs.ts
 * Sends rental application submissions to Openleasewithus@gmail.com via EmailJS.
 *
 * Setup (one-time, free):
 *   1. Go to https://www.emailjs.com and create a free account.
 *   2. Add a new Email Service (connect your Gmail: Openleasewithus@gmail.com).
 *   3. Create an Email Template — use the variable names below in your template body.
 *   4. Copy your Public Key (Account → API Keys), Service ID, and Template ID.
 *   5. Paste them into your .env file as shown in .env.example.
 *
 * Template variables available:
 *   {{to_email}}, {{reference_number}}, {{applicant_name}}, {{applicant_email}},
 *   {{applicant_phone}}, {{property_name}}, {{property_address}}, {{move_in_date}},
 *   {{occupation}}, {{marital_status}}, {{date_of_birth}}, {{num_adults}},
 *   {{current_address}}, {{monthly_income}}, {{renting_duration}},
 *   {{has_evictions}}, {{has_felonies}}, {{has_pets}}, {{pet_details}},
 *   {{payment_method}}, {{amount_available}}, {{has_co_applicant}},
 *   {{co_applicant_name}}, {{reason_for_moving}}, {{submitted_at}}
 */
import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || '';

export const isEmailJSConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export interface ApplicationEmailPayload {
  reference_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_name: string;
  property_address: string;
  preferred_move_in: string;
  occupation: string;
  marital_status: string;
  date_of_birth: string;
  num_adults: number;
  current_address: string;
  current_city: string;
  current_state: string;
  current_zip: string;
  monthly_income: number;
  renting_duration: string;
  has_evictions: boolean;
  has_felonies: boolean;
  has_pets: boolean;
  pet_details?: string;
  preferred_payment_method: string;
  amount_available_today: number;
  has_co_applicant: boolean;
  co_first_name?: string;
  co_last_name?: string;
  co_phone?: string;
  reason_for_moving?: string;
}

export async function sendApplicationEmail(payload: ApplicationEmailPayload): Promise<{ success: boolean; error?: string }> {
  if (!isEmailJSConfigured) {
    console.warn('[EmailJS] Not configured — skipping email send. Add VITE_EMAILJS_* keys to .env to enable.');
    return { success: true }; // Graceful no-op so the form still completes
  }

  const templateParams = {
    to_email:         'Openleasewithus@gmail.com',
    reference_number: payload.reference_number,
    applicant_name:   `${payload.first_name} ${payload.last_name}`,
    applicant_email:  payload.email,
    applicant_phone:  payload.phone,
    property_name:    payload.property_name || 'General Application',
    property_address: payload.property_address || 'Not specified',
    move_in_date:     payload.preferred_move_in,
    occupation:       payload.occupation,
    marital_status:   payload.marital_status,
    date_of_birth:    payload.date_of_birth,
    num_adults:       payload.num_adults,
    current_address:  `${payload.current_address}, ${payload.current_city}, ${payload.current_state} ${payload.current_zip}`,
    monthly_income:   `$${Number(payload.monthly_income).toLocaleString()}/mo`,
    renting_duration: payload.renting_duration,
    has_evictions:    payload.has_evictions ? 'YES' : 'No',
    has_felonies:     payload.has_felonies  ? 'YES' : 'No',
    has_pets:         payload.has_pets ? `Yes — ${payload.pet_details || 'details not provided'}` : 'No',
    pet_details:      payload.pet_details || 'N/A',
    payment_method:   payload.preferred_payment_method,
    amount_available: `$${Number(payload.amount_available_today).toLocaleString()}`,
    has_co_applicant: payload.has_co_applicant ? `Yes — ${payload.co_first_name} ${payload.co_last_name} (${payload.co_phone || 'no phone'})` : 'No',
    co_applicant_name: payload.has_co_applicant ? `${payload.co_first_name} ${payload.co_last_name}` : 'N/A',
    reason_for_moving: payload.reason_for_moving || 'Not provided',
    submitted_at:      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' }),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
    return { success: true };
  } catch (err: any) {
    console.error('[EmailJS] Send failed:', err);
    return { success: false, error: err?.text || err?.message || 'Email delivery failed' };
  }
}
