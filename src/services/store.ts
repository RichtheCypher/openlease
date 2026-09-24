import type { Property, RentalApplication, ApplicationStatus } from '../types';
import { INITIAL_PROPERTIES, INITIAL_APPLICATIONS } from '../data/initialProperties';
import { supabase, isSupabaseConfigured, getSupabaseDebugInfo, setRuntimeSupabaseConfig, clearRuntimeSupabaseConfig } from './supabase';

const PROPERTIES_KEY = 'openleasewithus_properties';
const APPLICATIONS_KEY = 'openleasewithus_applications';
const ADMIN_AUTH_KEY = 'openleasewithus_admin_session';

// Initialize local storage seeds if empty
function initializeLocalStore() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(PROPERTIES_KEY)) {
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
  }
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(INITIAL_APPLICATIONS));
  }
}

initializeLocalStore();

export const store = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  getDebugInfo() {
    return getSupabaseDebugInfo();
  },

  saveCredentials(url: string, key: string) {
    setRuntimeSupabaseConfig(url, key);
  },

  clearCredentials() {
    clearRuntimeSupabaseConfig();
  },

  // PROPERTIES
  async getProperties(): Promise<Property[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Property[];
        }
      } catch (e) {
        console.warn('Falling back to local properties cache:', e);
      }
    }
    const local = localStorage.getItem(PROPERTIES_KEY);
    return local ? JSON.parse(local) : INITIAL_PROPERTIES;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return data as Property;
        }
      } catch (e) {
        console.warn('Falling back to local property cache:', e);
      }
    }
    const properties = await this.getProperties();
    return properties.find(p => p.id === id) || null;
  },

  // APPLICATIONS
  async submitApplication(applicationData: Omit<RentalApplication, 'id' | 'reference_number' | 'status' | 'created_at'>): Promise<RentalApplication> {
    const referenceNumber = `OLW-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    
    const newApplication: RentalApplication = {
      ...applicationData,
      id: `app-${Date.now()}`,
      reference_number: referenceNumber,
      status: 'New',
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .insert([{
            reference_number: referenceNumber,
            property_id: applicationData.property_id || null,
            property_name: applicationData.property_name,
            property_address: applicationData.property_address,
            first_name: applicationData.first_name,
            last_name: applicationData.last_name,
            phone: applicationData.phone,
            email: applicationData.email,
            occupation: applicationData.occupation,
            marital_status: applicationData.marital_status,
            date_of_birth: applicationData.date_of_birth,
            num_adults: applicationData.num_adults,
            preferred_move_in: applicationData.preferred_move_in,
            current_address: applicationData.current_address,
            current_address_line2: applicationData.current_address_line2 || null,
            current_city: applicationData.current_city,
            current_state: applicationData.current_state,
            current_zip: applicationData.current_zip,
            current_country: applicationData.current_country || 'United States',
            has_co_applicant: applicationData.has_co_applicant,
            co_first_name: applicationData.co_first_name || null,
            co_last_name: applicationData.co_last_name || null,
            co_phone: applicationData.co_phone || null,
            has_pets: applicationData.has_pets,
            pet_details: applicationData.pet_details || null,
            monthly_income: applicationData.monthly_income,
            renting_duration: applicationData.renting_duration,
            has_evictions: applicationData.has_evictions,
            has_felonies: applicationData.has_felonies,
            preferred_payment_method: applicationData.preferred_payment_method,
            amount_available_today: applicationData.amount_available_today,
            reason_for_moving: applicationData.reason_for_moving || null,
            terms_agreed: applicationData.terms_agreed,
            signature_name: applicationData.signature_name,
            signature_image: applicationData.signature_image || null,
            documents: applicationData.documents || {},
            signature_date: now,
            status: 'New',
          }])
          .select()
          .single();

        if (!error && data) {
          return data as RentalApplication;
        }
      } catch (e) {
        console.warn('Supabase insert failed, saving to local store:', e);
      }
    }

    // Local storage save
    const current = localStorage.getItem(APPLICATIONS_KEY);
    const list: RentalApplication[] = current ? JSON.parse(current) : [];
    list.unshift(newApplication);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));

    return newApplication;
  },

  async getApplications(): Promise<RentalApplication[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data as RentalApplication[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, reading local store:', e);
      }
    }
    const current = localStorage.getItem(APPLICATIONS_KEY);
    return current ? JSON.parse(current) : INITIAL_APPLICATIONS;
  },

  async getApplicationById(id: string): Promise<RentalApplication | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return data as RentalApplication;
        }
      } catch (e) {
        console.warn('Supabase fetch single failed:', e);
      }
    }
    const applications = await this.getApplications();
    return applications.find(a => a.id === id || a.reference_number === id) || null;
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, staffNotes?: string): Promise<RentalApplication | null> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .update({
            status,
            staff_notes: staffNotes,
            updated_at: now
          })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          return data as RentalApplication;
        }
      } catch (e) {
        console.warn('Supabase update failed:', e);
      }
    }

    const current = localStorage.getItem(APPLICATIONS_KEY);
    const list: RentalApplication[] = current ? JSON.parse(current) : [];
    const index = list.findIndex(a => a.id === id || a.reference_number === id);
    if (index !== -1) {
      list[index].status = status;
      if (staffNotes !== undefined) {
        list[index].staff_notes = staffNotes;
      }
      list[index].updated_at = now;
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  // AUTHENTICATION
  async adminLogin(username: string, password?: string): Promise<{ success: boolean; user?: any; error?: string }> {
    const trimmedUsername = (username || '').trim();
    const trimmedPassword = (password || '').trim();
    const normalizedUsername = trimmedUsername.toLowerCase();

    // 1. Master Staff & Admin Credentials (works consistently across all devices and hosting platforms)
    const validUsers = ['admin', 'staff', 'admin@openleasewithus.com', 'owner', 'manager'];
    if (validUsers.includes(normalizedUsername) && trimmedPassword === 'OpenLease@Secure2026!') {
      const staffUser = {
        username: normalizedUsername,
        role: 'Staff Administrator',
        authenticated_at: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(staffUser));
      return { success: true, user: staffUser };
    }

    // 2. Optional Supabase Auth (for custom accounts registered in Supabase)
    if (isSupabaseConfigured && supabase && trimmedPassword) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedUsername,
          password: trimmedPassword
        });
        if (!error && data?.user) {
          const staffUser = {
            username: data.user.email,
            role: 'Staff Administrator',
            id: data.user.id,
            mode: 'supabase',
            authenticated_at: new Date().toISOString()
          };
          localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(staffUser));
          return { success: true, user: staffUser };
        }
      } catch (e: any) {
        console.warn('Supabase auth attempt failed:', e);
      }
    }

    return { success: false, error: 'Invalid username or password. Please verify your credentials.' };
  },

  adminLogout() {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(ADMIN_AUTH_KEY);
  },

  getAdminUser() {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem(ADMIN_AUTH_KEY);
    return session ? JSON.parse(session) : null;
  }
};
